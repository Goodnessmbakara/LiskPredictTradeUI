import { 
  users, predictions, trades, sentiment, portfolios,
  type User, type Prediction, type Trade, type Sentiment, type Portfolio,
  type InsertUser, type InsertPrediction, type InsertTrade, type InsertSentiment, type InsertPortfolio
} from "@shared/schema";
import { tokens as tokensTable } from "./db/schema";
import { db } from "./db";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByWallet(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Predictions  
  getAllPredictions(): Promise<Prediction[]>;
  getPredictionsBySymbol(symbol: string): Promise<Prediction[]>;
  createPrediction(prediction: InsertPrediction): Promise<Prediction>;
  
  // Trades
  getAllTrades(): Promise<Trade[]>;
  getTradesByUser(userId: number): Promise<Trade[]>;
  createTrade(trade: InsertTrade): Promise<Trade>;
  
  // Sentiment
  getLatestSentiment(): Promise<Sentiment[]>;
  getSentimentBySymbol(symbol: string): Promise<Sentiment[]>;
  createSentiment(sentiment: InsertSentiment): Promise<Sentiment>;
  
  // Portfolio
  getPortfolioByUser(userId: number): Promise<Portfolio | undefined>;
  updatePortfolio(userId: number, portfolio: InsertPortfolio): Promise<Portfolio>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private predictions: Map<number, Prediction>;
  private trades: Map<number, Trade>;
  private sentiment: Map<number, Sentiment>;
  private portfolios: Map<number, Portfolio>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.predictions = new Map();
    this.trades = new Map();
    this.sentiment = new Map();
    this.portfolios = new Map();
    this.currentId = 1;
    
    // Initialize with mock data
    this.initializeMockData();
  }

  private initializeMockData() {
    // Create demo user
    const demoUser: User = {
      id: 1,
      username: "demo_user",
      walletAddress: "0x742d35cc6bf000000000000000004b5f",
      balance: "2.45",
      createdAt: new Date(),
    };
    this.users.set(1, demoUser);

    // Create demo predictions
    const predictions: Prediction[] = [
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
    predictions.forEach(p => this.predictions.set(p.id, p));

    // Create demo trades
    const trades: Trade[] = [
      {
        id: 1,
        userId: 1,
        symbol: "ETH/USD",
        type: "buy",
        amount: "0.5",
        price: "2431.50",
        pnl: "47.82",
        isAutoTrade: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
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
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
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
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      },
    ];
    trades.forEach(t => this.trades.set(t.id, t));

    // Create demo sentiment data
    const sentimentData: Sentiment[] = [
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
    sentimentData.forEach(s => this.sentiment.set(s.id, s));

    // Create demo portfolio
    const portfolio: Portfolio = {
      id: 1,
      userId: 1,
      totalValue: "12547.82",
      dailyChange: "1028.45",
      dailyChangePercent: "8.20",
      updatedAt: new Date(),
    };
    this.portfolios.set(1, portfolio);

    this.currentId = 10; // Start IDs from 10 for new entries
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.walletAddress === walletAddress);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async getAllPredictions(): Promise<Prediction[]> {
    return Array.from(this.predictions.values());
  }

  async getPredictionsBySymbol(symbol: string): Promise<Prediction[]> {
    return Array.from(this.predictions.values()).filter(p => p.symbol === symbol);
  }

  async createPrediction(insertPrediction: InsertPrediction): Promise<Prediction> {
    const id = this.currentId++;
    const prediction: Prediction = { ...insertPrediction, id, createdAt: new Date() };
    this.predictions.set(id, prediction);
    return prediction;
  }

  async getAllTrades(): Promise<Trade[]> {
    return Array.from(this.trades.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getTradesByUser(userId: number): Promise<Trade[]> {
    return Array.from(this.trades.values())
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createTrade(insertTrade: InsertTrade): Promise<Trade> {
    const id = this.currentId++;
    const trade: Trade = { ...insertTrade, id, createdAt: new Date() };
    this.trades.set(id, trade);
    return trade;
  }

  async getLatestSentiment(): Promise<Sentiment[]> {
    return Array.from(this.sentiment.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getSentimentBySymbol(symbol: string): Promise<Sentiment[]> {
    return Array.from(this.sentiment.values())
      .filter(s => s.symbol === symbol)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createSentiment(insertSentiment: InsertSentiment): Promise<Sentiment> {
    const id = this.currentId++;
    const sentiment: Sentiment = { ...insertSentiment, id, createdAt: new Date() };
    this.sentiment.set(id, sentiment);
    return sentiment;
  }

  async getPortfolioByUser(userId: number): Promise<Portfolio | undefined> {
    return Array.from(this.portfolios.values()).find(p => p.userId === userId);
  }

  async updatePortfolio(userId: number, insertPortfolio: InsertPortfolio): Promise<Portfolio> {
    const existingPortfolio = await this.getPortfolioByUser(userId);
    if (existingPortfolio) {
      const updated: Portfolio = { ...existingPortfolio, ...insertPortfolio, updatedAt: new Date() };
      this.portfolios.set(existingPortfolio.id, updated);
      return updated;
    } else {
      const id = this.currentId++;
      const portfolio: Portfolio = { ...insertPortfolio, id, updatedAt: new Date() };
      this.portfolios.set(id, portfolio);
      return portfolio;
    }
  }
}

export const storage = new MemStorage();

export async function upsertTokens(tokenList) {
  for (const token of tokenList) {
    await db
      .insert(tokensTable)
      .values(token)
      .onConflictDoUpdate({
        target: tokensTable.address,
        set: token,
      });
  }
}

export async function getAllTokens() {
  return db.select().from(tokensTable);
}
