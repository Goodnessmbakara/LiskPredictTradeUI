import type { Prediction, Trade, Sentiment, Portfolio } from "@shared/schema";

export const mockPredictions: Prediction[] = [
  {
    id: 1,
    symbol: "ETH/USD",
    currentPrice: "2431.50",
    predictedPrice: "2487.82",
    confidence: "85.00",
    direction: "bullish",
    timeframe: "4h",
    createdAt: new Date(),
  },
  {
    id: 2,
    symbol: "BTC/USD",
    currentPrice: "42150.00",
    predictedPrice: "41391.30",
    confidence: "72.00",
    direction: "bearish",
    timeframe: "4h",
    createdAt: new Date(),
  },
  {
    id: 3,
    symbol: "LSK/USD",
    currentPrice: "1.42",
    predictedPrice: "1.50",
    confidence: "91.00",
    direction: "bullish",
    timeframe: "4h",
    createdAt: new Date(),
  },
];

export const mockTrades: Trade[] = [
  {
    id: 1,
    userId: 1,
    symbol: "ETH/USD",
    type: "buy",
    amount: "0.5",
    price: "2431.50",
    pnl: "47.82",
    isAutoTrade: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 2,
    userId: 1,
    symbol: "BTC/USD",
    type: "sell",
    amount: "0.02",
    price: "42150.00",
    pnl: "-12.30",
    isAutoTrade: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: 3,
    userId: 1,
    symbol: "LSK/USD",
    type: "buy",
    amount: "1000",
    price: "1.42",
    pnl: "87.50",
    isAutoTrade: true,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
];

export const mockSentiment: Sentiment[] = [
  {
    id: 1,
    source: "news",
    symbol: "ETH",
    score: "0.75",
    confidence: "85.00",
    title: "Ethereum upgrade shows strong network effects",
    content: "Recent Ethereum network upgrades demonstrate positive adoption metrics...",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 2,
    source: "news",
    symbol: "BTC",
    score: "0.15",
    confidence: "67.00",
    title: "Market volatility expected amid Fed decisions",
    content: "Federal Reserve policy decisions may impact cryptocurrency markets...",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: 3,
    source: "news",
    symbol: "LSK",
    score: "0.82",
    confidence: "92.00",
    title: "Lisk ecosystem shows growing adoption",
    content: "The Lisk blockchain ecosystem demonstrates increasing developer activity...",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
];

export const mockPortfolio: Portfolio = {
  id: 1,
  userId: 1,
  totalValue: "12547.82",
  dailyChange: "1028.45",
  dailyChangePercent: "8.20",
  updatedAt: new Date(),
};
