import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useTradingData } from "@/hooks/use-trading-data";
import { formatDistanceToNow } from "date-fns";

export function SentimentAnalysis() {
  const { sentiment } = useTradingData();

  const getOverallSentiment = () => {
    if (!sentiment || sentiment.length === 0) return { score: 0, label: "Neutral" };
    
    const avgScore = sentiment.reduce((sum, s) => sum + parseFloat(s.score), 0) / sentiment.length;
    
    if (avgScore > 0.3) return { score: avgScore * 100, label: "Bullish" };
    if (avgScore < -0.3) return { score: Math.abs(avgScore) * 100, label: "Bearish" };
    return { score: Math.abs(avgScore) * 100, label: "Neutral" };
  };

  const getSentimentColor = (score: string) => {
    const numScore = parseFloat(score);
    if (numScore > 0.3) return "text-chart-1";
    if (numScore < -0.3) return "text-chart-4";
    return "text-chart-3";
  };

  const getSentimentBadge = (score: string) => {
    const numScore = parseFloat(score);
    if (numScore > 0.3) return { variant: "default" as const, text: "Positive", color: "bg-chart-1/10 text-chart-1" };
    if (numScore < -0.3) return { variant: "destructive" as const, text: "Negative", color: "bg-chart-4/10 text-chart-4" };
    return { variant: "secondary" as const, text: "Neutral", color: "bg-chart-3/10 text-chart-3" };
  };

  const overall = getOverallSentiment();

  return (
    <Card className="trading-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Market Sentiment Analysis</CardTitle>
        <p className="text-sm text-muted-foreground">Real-time sentiment from news and social media</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Overall Sentiment */}
          <div className="text-center">
            <div className="w-24 h-24 mx-auto bg-chart-1/10 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl font-bold text-chart-1">{Math.round(overall.score)}</span>
            </div>
            <p className="text-sm text-muted-foreground">Overall Sentiment</p>
            <p className="font-medium text-chart-1">{overall.label}</p>
          </div>

          {/* Sentiment Breakdown */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">News Sentiment</span>
                <span className="text-chart-1">+68%</span>
              </div>
              <Progress value={68} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Social Media</span>
                <span className="text-chart-1">+81%</span>
              </div>
              <Progress value={81} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">On-Chain Activity</span>
                <span className="text-chart-3">+42%</span>
              </div>
              <Progress value={42} className="h-2" />
            </div>
          </div>

          {/* Recent News */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Recent Signals</h4>
            {sentiment?.slice(0, 3).map((item) => {
              const badge = getSentimentBadge(item.score);
              return (
                <div key={item.id} className="border-l-4 border-chart-1 pl-3 py-2">
                  <h5 className="font-medium text-sm text-foreground truncate">{item.title}</h5>
                  <p className="text-xs text-muted-foreground mb-2">
                    {item.source} • {formatDistanceToNow(new Date(item.createdAt!), { addSuffix: true })}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge className={badge.color}>{badge.text}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {parseFloat(item.confidence).toFixed(0)}% confidence
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
