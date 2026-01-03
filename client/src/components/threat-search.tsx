import { useState } from "react";
import { Search, Shield, ShieldAlert, ShieldCheck, ShieldX, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { ScamReport } from "@shared/schema";

interface ThreatSearchProps {
  compact?: boolean;
}

export function ThreatSearch({ compact = false }: ThreatSearchProps) {
  const [address, setAddress] = useState("");
  const [searchAddress, setSearchAddress] = useState("");

  const { data: results, isLoading, isFetched } = useQuery<ScamReport[]>({
    queryKey: ["/api/threats", searchAddress],
    enabled: searchAddress.length > 0,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      setSearchAddress(address.trim().toLowerCase());
    }
  };

  const getThreatLevel = () => {
    if (!results || results.length === 0) return "clean";
    const verified = results.filter(r => r.status === "verified");
    if (verified.length > 0) return "verified";
    return "suspicious";
  };

  const threatLevel = getThreatLevel();

  const renderResult = () => {
    if (!isFetched || !searchAddress) return null;

    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (threatLevel === "clean") {
      return (
        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
              <ShieldCheck className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold text-green-600 dark:text-green-400">Address Clean</h3>
              <p className="text-sm text-muted-foreground">No threats found in our database</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (threatLevel === "verified") {
      const verifiedReports = results?.filter(r => r.status === "verified") || [];
      return (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
                <ShieldX className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <CardTitle className="text-red-600 dark:text-red-400">Verified Threat</CardTitle>
                <p className="text-sm text-muted-foreground">{verifiedReports.length} confirmed report(s)</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {verifiedReports.map((report) => (
              <div key={report.id} className="rounded-md bg-background/50 p-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="destructive" className="text-xs">{report.scamType}</Badge>
                  <Badge variant="outline" className="text-xs">{report.severity}</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{report.description}</p>
                {report.amountLost && (
                  <p className="mt-1 text-xs text-red-500">Amount lost: {report.amountLost}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="border-yellow-500/30 bg-yellow-500/5">
        <CardContent className="flex items-center gap-4 py-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20">
            <ShieldAlert className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <h3 className="font-semibold text-yellow-600 dark:text-yellow-400">Under Review</h3>
            <p className="text-sm text-muted-foreground">{results?.length} pending report(s) - awaiting verification</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={compact ? "space-y-4" : "space-y-6"}>
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter wallet address (0x...)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="pl-10 font-mono text-sm"
            data-testid="input-threat-address"
          />
        </div>
        <Button type="submit" disabled={isLoading || !address.trim()} data-testid="button-search-threat">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
          <span className="ml-2 hidden sm:inline">Check</span>
        </Button>
      </form>
      {renderResult()}
    </div>
  );
}
