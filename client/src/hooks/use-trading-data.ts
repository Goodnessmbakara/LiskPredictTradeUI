import { useQuery } from "@tanstack/react-query";
import type { Prediction, Trade, Sentiment, Portfolio } from "@shared/schema";

export function useTradingData() {
  const { data: predictions } = useQuery<Prediction[]>({
    queryKey: ["/api/predictions"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: trades } = useQuery<Trade[]>({
    queryKey: ["/api/trades"],
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  const { data: sentiment } = useQuery<Sentiment[]>({
    queryKey: ["/api/sentiment"],
    refetchInterval: 60000, // Refetch every minute
  });

  const { data: portfolio } = useQuery<Portfolio>({
    queryKey: ["/api/portfolio/1"], // Demo user ID
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return {
    predictions,
    trades,
    sentiment,
    portfolio,
  };
}
