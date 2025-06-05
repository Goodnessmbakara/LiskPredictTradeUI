import { TrendingUp, Brain, Bot, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTradingData } from "@/hooks/use-trading-data";

export function StatsCards() {
  const { portfolio, predictions, trades } = useTradingData();

  const stats = [
    {
      title: "Portfolio Value",
      value: portfolio ? `$${parseFloat(portfolio.totalValue).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : "$0.00",
      change: portfolio ? `+${portfolio.dailyChangePercent}%` : "+0%",
      icon: TrendingUp,
      iconColor: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Active Predictions",
      value: predictions?.length.toString() || "0",
      change: "78% Accuracy",
      icon: Brain,
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Auto Trades",
      value: trades?.filter(t => t.isAutoTrade).length.toString() || "0",
      change: "+$1,247 profit",
      icon: Bot,
      iconColor: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "24h P&L",
      value: portfolio ? `+$${portfolio.dailyChange}` : "+$0.00",
      change: portfolio ? `+${portfolio.dailyChangePercent}%` : "+0%",
      icon: DollarSign,
      iconColor: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="trading-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span className="text-chart-1 text-sm font-medium">{stat.change}</span>
                {stat.title !== "Active Predictions" && stat.title !== "Auto Trades" && (
                  <span className="text-muted-foreground text-sm ml-2">24h</span>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
