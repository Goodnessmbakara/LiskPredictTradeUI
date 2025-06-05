import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useTradingData } from "@/hooks/use-trading-data";

export function PredictionPanel() {
  const { predictions } = useTradingData();

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case "bullish":
        return <TrendingUp className="h-4 w-4 text-chart-1" />;
      case "bearish":
        return <TrendingDown className="h-4 w-4 text-chart-4" />;
      default:
        return <Minus className="h-4 w-4 text-chart-3" />;
    }
  };

  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case "bullish":
        return "text-chart-1";
      case "bearish":
        return "text-chart-4";
      default:
        return "text-chart-3";
    }
  };

  const getBadgeColor = (direction: string) => {
    switch (direction) {
      case "bullish":
        return "prediction-badge bullish";
      case "bearish":
        return "prediction-badge bearish";
      default:
        return "prediction-badge neutral";
    }
  };

  return (
    <Card className="trading-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">AI Predictions</CardTitle>
        <p className="text-sm text-muted-foreground">Real-time LSTM model predictions</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {predictions?.map((prediction) => (
          <div key={prediction.id} className="border border-border rounded-lg p-4 bg-muted/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getDirectionIcon(prediction.direction)}
                <span className="font-medium text-foreground">{prediction.symbol}</span>
              </div>
              <span className={getBadgeColor(prediction.direction)}>
                {parseFloat(prediction.confidence).toFixed(0)}% Confidence
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-muted-foreground">Current: ${prediction.currentPrice}</span>
              <span className={`font-medium ${getDirectionColor(prediction.direction)}`}>
                Target: ${prediction.predictedPrice}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Confidence Level</span>
                <span className="text-foreground">{prediction.confidence}%</span>
              </div>
              <Progress 
                value={parseFloat(prediction.confidence)} 
                className="h-2"
              />
            </div>
            
            <div className="flex items-center justify-between text-xs mt-2">
              <span className="text-muted-foreground">Timeframe: {prediction.timeframe}</span>
              <span className={`font-medium ${getDirectionColor(prediction.direction)}`}>
                {prediction.direction.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
