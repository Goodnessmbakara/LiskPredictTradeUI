import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTradingData } from "@/hooks/use-trading-data";
import { formatDistanceToNow } from "date-fns";

export function TradeHistory() {
  const { trades } = useTradingData();

  const formatTime = (date: Date | string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const formatPnL = (pnl: string) => {
    const value = parseFloat(pnl);
    const sign = value >= 0 ? "+" : "";
    return `${sign}$${Math.abs(value).toFixed(2)}`;
  };

  const getPnLColor = (pnl: string) => {
    return parseFloat(pnl) >= 0 ? "text-chart-1" : "text-chart-4";
  };

  return (
    <Card className="trading-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">Recent Trades</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground border-b border-border">
                <th className="text-left py-3">Time</th>
                <th className="text-left py-3">Pair</th>
                <th className="text-left py-3">Type</th>
                <th className="text-right py-3">Amount</th>
                <th className="text-right py-3">Price</th>
                <th className="text-right py-3">P&L</th>
              </tr>
            </thead>
            <tbody>
              {trades?.slice(0, 6).map((trade) => (
                <tr key={trade.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-3 text-muted-foreground">
                    {formatTime(trade.createdAt!)}
                  </td>
                  <td className="py-3 font-medium text-foreground">{trade.symbol}</td>
                  <td className="py-3">
                    <Badge 
                      variant={trade.type === "buy" ? "default" : "destructive"}
                      className={trade.type === "buy" ? "bg-chart-1/10 text-chart-1" : "bg-chart-4/10 text-chart-4"}
                    >
                      {trade.type.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3 text-right font-mono text-foreground">
                    {parseFloat(trade.amount).toFixed(trade.symbol.includes("LSK") ? 0 : 3)} {trade.symbol.split("/")[0]}
                  </td>
                  <td className="py-3 text-right font-mono text-foreground">
                    ${parseFloat(trade.price).toLocaleString()}
                  </td>
                  <td className={`py-3 text-right font-mono font-medium ${getPnLColor(trade.pnl)}`}>
                    {formatPnL(trade.pnl)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
