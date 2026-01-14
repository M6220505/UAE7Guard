import { Alchemy, Network, AssetTransfersCategory, SortingOrder } from "alchemy-sdk";
import { getBitcoinAddressInfo, getBitcoinTransactions, calculateBitcoinWalletAge, type BitcoinAddressInfo } from "./bitcoin";

const alchemyApiKey = process.env.ALCHEMY_API_KEY;

function getAlchemyClient(network: Network = Network.ETH_MAINNET) {
  if (!alchemyApiKey) {
    throw new Error("ALCHEMY_API_KEY is not configured");
  }
  
  return new Alchemy({
    apiKey: alchemyApiKey,
    network,
  });
}

export interface WalletBalance {
  address: string;
  network: string;
  balance: string;
  balanceInEth: string;
}

export interface TransactionInfo {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  asset: string;
  category: string;
  blockNum: string;
}

export interface ContractInfo {
  isContract: boolean;
  contractDeployer?: string;
  deployedBlockNumber?: number;
}

export interface WalletData {
  balance: WalletBalance;
  transactions: TransactionInfo[];
  contractInfo: ContractInfo;
}

const networkMap: Record<string, Network> = {
  ethereum: Network.ETH_MAINNET,
  polygon: Network.MATIC_MAINNET,
  arbitrum: Network.ARB_MAINNET,
  optimism: Network.OPT_MAINNET,
  base: Network.BASE_MAINNET,
  bsc: Network.BNB_MAINNET,
};

export const SUPPORTED_NETWORKS = [
  { id: "ethereum", name: "Ethereum", symbol: "ETH", type: "evm" },
  { id: "polygon", name: "Polygon", symbol: "MATIC", type: "evm" },
  { id: "bsc", name: "BNB Smart Chain", symbol: "BNB", type: "evm" },
  { id: "arbitrum", name: "Arbitrum", symbol: "ETH", type: "evm" },
  { id: "optimism", name: "Optimism", symbol: "ETH", type: "evm" },
  { id: "base", name: "Base", symbol: "ETH", type: "evm" },
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", type: "utxo" },
] as const;

export type SupportedNetwork = typeof SUPPORTED_NETWORKS[number]["id"];

export async function getWalletBalance(
  address: string,
  networkName: string = "ethereum"
): Promise<WalletBalance> {
  const network = networkMap[networkName] || Network.ETH_MAINNET;
  const alchemy = getAlchemyClient(network);
  
  const balance = await alchemy.core.getBalance(address);
  const balanceInEth = parseFloat(balance.toString()) / 1e18;
  
  return {
    address,
    network: networkName,
    balance: balance.toString(),
    balanceInEth: balanceInEth.toFixed(6),
  };
}

export async function getRecentTransactions(
  address: string,
  networkName: string = "ethereum",
  limit: number = 10
): Promise<TransactionInfo[]> {
  const network = networkMap[networkName] || Network.ETH_MAINNET;
  const alchemy = getAlchemyClient(network);
  
  const transfers = await alchemy.core.getAssetTransfers({
    fromAddress: address,
    category: [
      AssetTransfersCategory.EXTERNAL,
      AssetTransfersCategory.INTERNAL,
      AssetTransfersCategory.ERC20,
      AssetTransfersCategory.ERC721,
      AssetTransfersCategory.ERC1155,
    ],
    maxCount: limit,
    order: SortingOrder.DESCENDING,
  });

  const incomingTransfers = await alchemy.core.getAssetTransfers({
    toAddress: address,
    category: [
      AssetTransfersCategory.EXTERNAL,
      AssetTransfersCategory.INTERNAL,
      AssetTransfersCategory.ERC20,
      AssetTransfersCategory.ERC721,
      AssetTransfersCategory.ERC1155,
    ],
    maxCount: limit,
    order: SortingOrder.DESCENDING,
  });

  const allTransfers = [...transfers.transfers, ...incomingTransfers.transfers]
    .sort((a, b) => {
      const blockA = parseInt(a.blockNum, 16);
      const blockB = parseInt(b.blockNum, 16);
      return blockB - blockA;
    })
    .slice(0, limit);

  return allTransfers.map((tx) => ({
    hash: tx.hash || "",
    from: tx.from || "",
    to: tx.to || null,
    value: tx.value?.toString() || "0",
    asset: tx.asset || "ETH",
    category: tx.category,
    blockNum: tx.blockNum,
  }));
}

export async function checkIfContract(
  address: string,
  networkName: string = "ethereum"
): Promise<ContractInfo> {
  const network = networkMap[networkName] || Network.ETH_MAINNET;
  const alchemy = getAlchemyClient(network);
  
  try {
    const code = await alchemy.core.getCode(address);
    const isContract = code !== "0x";
    
    if (isContract) {
      try {
        const metadata = await alchemy.core.findContractDeployer(address);
        return {
          isContract: true,
          contractDeployer: metadata.deployerAddress || undefined,
          deployedBlockNumber: metadata.blockNumber || undefined,
        };
      } catch {
        return { isContract: true };
      }
    }
    
    return { isContract: false };
  } catch {
    return { isContract: false };
  }
}

export async function getFullWalletData(
  address: string,
  networkName: string = "ethereum"
): Promise<WalletData> {
  const [balance, transactions, contractInfo] = await Promise.all([
    getWalletBalance(address, networkName),
    getRecentTransactions(address, networkName),
    checkIfContract(address, networkName),
  ]);
  
  return {
    balance,
    transactions,
    contractInfo,
  };
}

export function isAlchemyConfigured(): boolean {
  return !!alchemyApiKey;
}

export interface HybridWalletSnapshot {
  balance: WalletBalance;
  transactions: TransactionInfo[];
  transactionCount: number;
  walletAgeDays: number;
  isContract: boolean;
  network: string;
  firstTransactionBlock: string | null;
}

export async function getHybridWalletSnapshot(
  address: string,
  networkName: string = "ethereum"
): Promise<HybridWalletSnapshot> {
  const network = networkMap[networkName] || Network.ETH_MAINNET;
  const alchemy = getAlchemyClient(network);
  
  const [balance, transactions, contractInfo] = await Promise.all([
    getWalletBalance(address, networkName),
    getRecentTransactions(address, networkName, 20),
    checkIfContract(address, networkName),
  ]);

  let walletAgeDays = 0;
  let firstTransactionBlock: string | null = null;
  
  try {
    const allTransfers = await alchemy.core.getAssetTransfers({
      toAddress: address,
      category: [AssetTransfersCategory.EXTERNAL],
      order: SortingOrder.ASCENDING,
      maxCount: 1,
    });
    
    if (allTransfers.transfers.length > 0) {
      firstTransactionBlock = allTransfers.transfers[0].blockNum;
      const blockNumber = parseInt(firstTransactionBlock, 16);
      const block = await alchemy.core.getBlock(blockNumber);
      if (block && block.timestamp) {
        const firstTxDate = new Date(block.timestamp * 1000);
        const now = new Date();
        walletAgeDays = Math.floor((now.getTime() - firstTxDate.getTime()) / (1000 * 60 * 60 * 24));
      }
    }
  } catch (error) {
    console.log("Could not determine wallet age:", error);
  }

  return {
    balance,
    transactions,
    transactionCount: transactions.length,
    walletAgeDays,
    isContract: contractInfo.isContract,
    network: networkName,
    firstTransactionBlock,
  };
}

export interface UnifiedWalletData {
  address: string;
  network: string;
  networkType: "evm" | "utxo";
  isValid: boolean;
  balance: string;
  balanceFormatted: string;
  symbol: string;
  transactionCount: number;
  walletAgeDays: number;
  isContract: boolean;
  addressType?: string;
  transactions: Array<{
    hash: string;
    from: string;
    to: string | null;
    value: string;
  }>;
}

export async function getUnifiedWalletData(
  address: string,
  networkName: string = "ethereum"
): Promise<UnifiedWalletData> {
  const networkInfo = SUPPORTED_NETWORKS.find(n => n.id === networkName);
  
  if (!networkInfo) {
    throw new Error(`Unsupported network: ${networkName}`);
  }

  if (networkName === "bitcoin") {
    const btcInfo = await getBitcoinAddressInfo(address);
    const btcTxs = await getBitcoinTransactions(address, 10);
    const walletAge = calculateBitcoinWalletAge(btcInfo.firstSeen);

    return {
      address,
      network: "bitcoin",
      networkType: "utxo",
      isValid: btcInfo.isValid,
      balance: btcInfo.balance,
      balanceFormatted: btcInfo.balanceInBtc + " BTC",
      symbol: "BTC",
      transactionCount: btcInfo.transactionCount,
      walletAgeDays: walletAge,
      isContract: false,
      addressType: btcInfo.addressType,
      transactions: btcTxs.map(tx => ({
        hash: tx.hash,
        from: tx.from[0] || "",
        to: tx.to[0] || null,
        value: tx.value,
      })),
    };
  }

  if (!isAlchemyConfigured()) {
    throw new Error("ALCHEMY_API_KEY is required for EVM networks");
  }

  const snapshot = await getHybridWalletSnapshot(address, networkName);

  return {
    address,
    network: networkName,
    networkType: "evm",
    isValid: true,
    balance: snapshot.balance.balance,
    balanceFormatted: snapshot.balance.balanceInEth + " " + networkInfo.symbol,
    symbol: networkInfo.symbol,
    transactionCount: snapshot.transactionCount,
    walletAgeDays: snapshot.walletAgeDays,
    isContract: snapshot.isContract,
    transactions: snapshot.transactions.map(tx => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: tx.value,
    })),
  };
}

export function validateAddress(address: string, network: string): boolean {
  if (network === "bitcoin") {
    if (address.startsWith("1") || address.startsWith("3")) {
      return address.length >= 25 && address.length <= 34;
    }
    if (address.startsWith("bc1")) {
      return address.length >= 42 && address.length <= 62;
    }
    return false;
  }

  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
