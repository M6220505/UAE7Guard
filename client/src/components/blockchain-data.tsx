import { useQuery } from "@tanstack/react-query";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  FileCode2, 
  AlertTriangle,
  CheckCircle,
  Loader2,
  Activity,
  Clock,
  Hash
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface WalletBalance {
  address: string;
  network: string;
  balance: string;
  balanceInEth: string;
}

interface TransactionInfo {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  asset: string;
  category: string;
  blockNum: string;
}

interface ContractInfo {
  isContract: boolean;
  contractDeployer?: string;
  deployedBlockNumber?: number;
}

interface WalletData {
  balance: WalletBalance;
  transactions: TransactionInfo[];
  contractInfo: ContractInfo;
}

interface BlockchainDataProps {
  address: string;
  network?: string;
  onDataLoaded?: (data: WalletData) => void;
}

export function BlockchainData({ address, network = "ethereum", onDataLoaded }: BlockchainDataProps) {
  const { data, isLoading, error } = useQuery<WalletData>({
    queryKey: ["/api/blockchain/wallet", address, network],
    queryFn: async () => {
      const res = await fetch(`/api/blockchain/wallet/${address}?network=${network}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || err.error || "Failed to fetch blockchain data");
      }
      const walletData = await res.json();
      if (onDataLoaded) {
        onDataLoaded(walletData);
      }
      return walletData;
    },
    enabled: !!address && /^0x[a-fA-F0-9]{40}$/.test(address),
    staleTime: 30000,
    retry: 1,
  });

  const { data: statusData } = useQuery<{ configured: boolean }>({
    queryKey: ["/api/blockchain/status"],
  });

  if (!statusData?.configured) {
    return (
      <Alert className="border-amber-500/30 bg-amber-500/10">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertTitle className="text-amber-400">Blockchain Service Not Configured</AlertTitle>
        <AlertDescription className="text-amber-300/80">
          Live blockchain data is unavailable. Please configure ALCHEMY_API_KEY to enable real-time wallet analysis.
        </AlertDescription>
      </Alert>
    );
  }

  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return null;
  }

  if (isLoading) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            Fetching Live Blockchain Data...
          </CardTitle>
          <CardDescription>Connecting to {network} network</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-500/30 bg-red-500/10">
        <AlertTriangle className="h-4 w-4 text-red-500" />
        <AlertTitle className="text-red-400">Error Fetching Blockchain Data</AlertTitle>
        <AlertDescription className="text-red-300/80">
          {(error as Error).message || "Network may be slow or address not found. Please try again."}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return null;
  }

  const networkSymbol = network === "polygon" ? "MATIC" : "ETH";
  const explorerUrl = network === "polygon" 
    ? `https://polygonscan.com/address/${address}`
    : `https://etherscan.io/address/${address}`;

  return (
    <div className="space-y-4">
      <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-green-500" />
              Live Blockchain Data
            </CardTitle>
            <Badge variant="secondary" className="gap-1 bg-green-500/20 text-green-400">
              <CheckCircle className="h-3 w-3" />
              Live
            </Badge>
          </div>
          <CardDescription>Real-time data from {network} network via Alchemy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-muted/50 p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Wallet className="h-4 w-4" />
                Current Balance
              </div>
              <div className="text-2xl font-bold">
                {parseFloat(data.balance.balanceInEth).toFixed(4)} {networkSymbol}
              </div>
            </div>
            
            <div className="rounded-lg bg-muted/50 p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <FileCode2 className="h-4 w-4" />
                Contract Status
              </div>
              <div className="flex items-center gap-2">
                {data.contractInfo.isContract ? (
                  <>
                    <Badge className="bg-purple-500/20 text-purple-400">Smart Contract</Badge>
                    {data.contractInfo.deployedBlockNumber && (
                      <span className="text-xs text-muted-foreground">
                        Block #{data.contractInfo.deployedBlockNumber}
                      </span>
                    )}
                  </>
                ) : (
                  <Badge variant="secondary">Regular Wallet (EOA)</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5" />
            Recent Transactions ({data.transactions.length})
          </CardTitle>
          <CardDescription>Last 10 transactions for this wallet</CardDescription>
        </CardHeader>
        <CardContent>
          {data.transactions.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No recent transactions found
            </div>
          ) : (
            <div className="space-y-2">
              {data.transactions.slice(0, 10).map((tx, index) => {
                const isIncoming = tx.to?.toLowerCase() === address.toLowerCase();
                return (
                  <div
                    key={tx.hash || index}
                    className="flex items-center justify-between rounded-lg bg-muted/30 p-3 hover-elevate"
                    data-testid={`tx-row-${index}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`rounded-full p-2 ${isIncoming ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        {isIncoming ? (
                          <ArrowDownLeft className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          {isIncoming ? 'Received' : 'Sent'}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Hash className="h-3 w-3" />
                          {tx.hash ? `${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}` : 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-medium text-sm">
                        {parseFloat(tx.value || '0').toFixed(4)} {tx.asset}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {tx.category}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 text-sm text-primary hover:underline"
            data-testid="link-explorer"
          >
            View on {network === "polygon" ? "PolygonScan" : "Etherscan"}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

export function BlockchainStatus() {
  const { data, isLoading } = useQuery<{ configured: boolean }>({
    queryKey: ["/api/blockchain/status"],
  });

  if (isLoading) {
    return <Skeleton className="h-6 w-32" />;
  }

  return (
    <Badge variant={data?.configured ? "secondary" : "outline"} className="gap-1">
      {data?.configured ? (
        <>
          <CheckCircle className="h-3 w-3 text-green-500" />
          Blockchain Live
        </>
      ) : (
        <>
          <AlertTriangle className="h-3 w-3 text-amber-500" />
          Offline
        </>
      )}
    </Badge>
  );
}
