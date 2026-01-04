import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }
  return crypto.createHash('sha256').update(key).digest();
}

export function isEncryptionConfigured(): boolean {
  return !!process.env.ENCRYPTION_KEY;
}

export interface EncryptedData {
  encryptedData: string;
  iv: string;
  authTag: string;
}

export function encryptData(data: string): EncryptedData {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return {
    encryptedData: encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
  };
}

export function decryptData(encryptedData: string, iv: string, authTag: string): string {
  const key = getEncryptionKey();
  const ivBuffer = Buffer.from(iv, 'hex');
  const authTagBuffer = Buffer.from(authTag, 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, ivBuffer);
  decipher.setAuthTag(authTagBuffer);
  
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

export function createDataHash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function generateTransactionHash(walletAddress: string, timestamp: Date, value: string): string {
  const input = `${walletAddress}-${timestamp.toISOString()}-${value}`;
  return crypto.createHash('sha256').update(input).digest('hex').slice(0, 16);
}

export interface AuditLogData {
  walletAddress: string;
  transactionValueAED: number;
  riskScore: number;
  riskLevel: string;
  analysisDetails: {
    historyScore: number;
    associationScore: number;
    walletAgeDays: number;
    formula: string;
  };
  blockchainData?: {
    balance: string;
    transactionCount: number;
    isSmartContract: boolean;
    network: string;
  };
  timestamp: string;
  analyst?: string;
}

export function createEncryptedAuditLog(data: AuditLogData): {
  transactionHash: string;
  encryptedData: string;
  encryptionIV: string;
  dataHash: string;
  timestampUtc: Date;
} {
  const timestamp = new Date();
  const dataString = JSON.stringify({
    ...data,
    timestamp: timestamp.toISOString(),
    createdAt: timestamp.toISOString(),
  });
  
  const transactionHash = generateTransactionHash(
    data.walletAddress,
    timestamp,
    data.transactionValueAED.toString()
  );
  
  const dataHash = createDataHash(dataString);
  const encrypted = encryptData(dataString);
  
  return {
    transactionHash,
    encryptedData: encrypted.encryptedData + ':' + encrypted.authTag,
    encryptionIV: encrypted.iv,
    dataHash,
    timestampUtc: timestamp,
  };
}

export function decryptAuditLog(encryptedData: string, iv: string): AuditLogData | null {
  try {
    const [data, authTag] = encryptedData.split(':');
    const decrypted = decryptData(data, iv, authTag);
    return JSON.parse(decrypted) as AuditLogData;
  } catch (error) {
    console.error('Failed to decrypt audit log:', error);
    return null;
  }
}
