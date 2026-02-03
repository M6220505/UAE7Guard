export interface BitcoinAddressInfo {
  address: string;
  network: "bitcoin";
  isValid: boolean;
  addressType: "legacy" | "segwit" | "native-segwit" | "taproot" | "unknown";
  balance: string;
  balanceInBtc: string;
  transactionCount: number;
  firstSeen: string | null;
  lastSeen: string | null;
}

export interface BitcoinTransaction {
  hash: string;
  from: string[];
  to: string[];
  value: string;
  confirmed: boolean;
  blockHeight: number | null;
  timestamp: string | null;
}

function detectBitcoinAddressType(address: string): BitcoinAddressInfo["addressType"] {
  if (address.startsWith("1")) {
    return "legacy";
  }
  if (address.startsWith("3")) {
    return "segwit";
  }
  if (address.startsWith("bc1q")) {
    return "native-segwit";
  }
  if (address.startsWith("bc1p")) {
    return "taproot";
  }
  return "unknown";
}

function validateBitcoinAddress(address: string): boolean {
  if (address.startsWith("1")) {
    return address.length >= 25 && address.length <= 34;
  }
  if (address.startsWith("3")) {
    return address.length >= 25 && address.length <= 34;
  }
  if (address.startsWith("bc1q")) {
    return address.length >= 42 && address.length <= 62;
  }
  if (address.startsWith("bc1p")) {
    return address.length >= 62 && address.length <= 62;
  }
  return false;
}

export async function getBitcoinAddressInfo(address: string): Promise<BitcoinAddressInfo> {
  const isValid = validateBitcoinAddress(address);
  const addressType = detectBitcoinAddressType(address);

  if (!isValid) {
    return {
      address,
      network: "bitcoin",
      isValid: false,
      addressType: "unknown",
      balance: "0",
      balanceInBtc: "0",
      transactionCount: 0,
      firstSeen: null,
      lastSeen: null,
    };
  }

  try {
    const response = await fetch(`https://blockchain.info/rawaddr/${address}?limit=1`);
    
    if (!response.ok) {
      return {
        address,
        network: "bitcoin",
        isValid: true,
        addressType,
        balance: "0",
        balanceInBtc: "0",
        transactionCount: 0,
        firstSeen: null,
        lastSeen: null,
      };
    }

    const data = await response.json();
    const balanceInSatoshis = data.final_balance || 0;
    const balanceInBtc = (balanceInSatoshis / 100000000).toFixed(8);

    let firstSeen: string | null = null;
    let lastSeen: string | null = null;

    if (data.txs && data.txs.length > 0) {
      const lastTx = data.txs[0];
      if (lastTx.time) {
        lastSeen = new Date(lastTx.time * 1000).toISOString();
      }
    }

    if (data.n_tx > 0) {
      try {
        const firstTxResponse = await fetch(`https://blockchain.info/rawaddr/${address}?limit=1&offset=${data.n_tx - 1}`);
        if (firstTxResponse.ok) {
          const firstTxData = await firstTxResponse.json();
          if (firstTxData.txs && firstTxData.txs.length > 0 && firstTxData.txs[0].time) {
            firstSeen = new Date(firstTxData.txs[0].time * 1000).toISOString();
          }
        }
      } catch {
      }
    }

    return {
      address,
      network: "bitcoin",
      isValid: true,
      addressType,
      balance: balanceInSatoshis.toString(),
      balanceInBtc,
      transactionCount: data.n_tx || 0,
      firstSeen,
      lastSeen,
    };
  } catch (error) {
    console.error("Bitcoin API error:", error);
    return {
      address,
      network: "bitcoin",
      isValid: true,
      addressType,
      balance: "0",
      balanceInBtc: "0",
      transactionCount: 0,
      firstSeen: null,
      lastSeen: null,
    };
  }
}

export async function getBitcoinTransactions(address: string, limit: number = 10): Promise<BitcoinTransaction[]> {
  try {
    const response = await fetch(`https://blockchain.info/rawaddr/${address}?limit=${limit}`);
    
    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const transactions: BitcoinTransaction[] = [];

    if (data.txs) {
      for (const tx of data.txs.slice(0, limit)) {
        const inputs = tx.inputs?.map((i: any) => i.prev_out?.addr).filter(Boolean) || [];
        const outputs = tx.out?.map((o: any) => o.addr).filter(Boolean) || [];
        
        let value = "0";
        for (const out of tx.out || []) {
          if (out.addr === address) {
            value = (out.value / 100000000).toFixed(8);
            break;
          }
        }

        transactions.push({
          hash: tx.hash,
          from: inputs,
          to: outputs,
          value,
          confirmed: tx.block_height !== null,
          blockHeight: tx.block_height || null,
          timestamp: tx.time ? new Date(tx.time * 1000).toISOString() : null,
        });
      }
    }

    return transactions;
  } catch (error) {
    console.error("Bitcoin transactions error:", error);
    return [];
  }
}

export function calculateBitcoinWalletAge(firstSeen: string | null): number {
  if (!firstSeen) return 0;
  
  const firstDate = new Date(firstSeen);
  const now = new Date();
  return Math.floor((now.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
}
