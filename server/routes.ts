import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTradeSchema, insertSentimentSchema } from "@shared/schema";
import { z } from "zod";
import axios from "axios";
import { upsertTokens, getAllTokens } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all predictions
  app.get("/api/predictions", async (req, res) => {
    try {
      const predictions = await storage.getAllPredictions();
      res.json(predictions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch predictions" });
    }
  });

  // Get predictions by symbol
  app.get("/api/predictions/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const predictions = await storage.getPredictionsBySymbol(symbol);
      res.json(predictions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch predictions" });
    }
  });

  // Get all trades
  app.get("/api/trades", async (req, res) => {
    try {
      const trades = await storage.getAllTrades();
      res.json(trades);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trades" });
    }
  });

  // Get trades by user
  app.get("/api/trades/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const trades = await storage.getTradesByUser(userId);
      res.json(trades);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user trades" });
    }
  });

  // Create new trade
  app.post("/api/trades", async (req, res) => {
    try {
      const tradeData = insertTradeSchema.parse(req.body);
      const trade = await storage.createTrade(tradeData);
      res.status(201).json(trade);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid trade data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create trade" });
      }
    }
  });

  // Get latest sentiment data
  app.get("/api/sentiment", async (req, res) => {
    try {
      const sentiment = await storage.getLatestSentiment();
      res.json(sentiment);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sentiment data" });
    }
  });

  // Get sentiment by symbol
  app.get("/api/sentiment/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const sentiment = await storage.getSentimentBySymbol(symbol);
      res.json(sentiment);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sentiment data" });
    }
  });

  // Get portfolio by user
  app.get("/api/portfolio/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const portfolio = await storage.getPortfolioByUser(userId);
      if (!portfolio) {
        res.status(404).json({ error: "Portfolio not found" });
        return;
      }
      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch portfolio" });
    }
  });

  // Get user by wallet address
  app.get("/api/user/wallet/:address", async (req, res) => {
    try {
      const { address } = req.params;
      const user = await storage.getUserByWallet(address);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Mock deposit endpoint
  app.post("/api/deposit", async (req, res) => {
    try {
      const { amount, token, userId } = req.body;
      
      // Simulate deposit processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would interact with blockchain
      res.json({ 
        success: true, 
        message: `Successfully deposited ${amount} ${token}`,
        transactionHash: "0x" + Math.random().toString(16).substr(2, 64)
      });
    } catch (error) {
      res.status(500).json({ error: "Deposit failed" });
    }
  });

  // Mock withdraw endpoint
  app.post("/api/withdraw", async (req, res) => {
    try {
      const { amount, token, address, userId } = req.body;
      
      // Simulate withdraw processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would interact with blockchain
      res.json({ 
        success: true, 
        message: `Successfully withdrew ${amount} ${token} to ${address}`,
        transactionHash: "0x" + Math.random().toString(16).substr(2, 64)
      });
    } catch (error) {
      res.status(500).json({ error: "Withdrawal failed" });
    }
  });

  // Generate new AI prediction (mock endpoint)
  app.post("/api/predictions/generate", async (req, res) => {
    try {
      const { symbol } = req.body;
      
      // Simulate AI model processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock prediction
      const currentPrice = Math.random() * 1000 + 1000;
      const change = (Math.random() - 0.5) * 0.1; // ±5% change
      const predictedPrice = currentPrice * (1 + change);
      const confidence = Math.random() * 30 + 70; // 70-100% confidence
      
      const prediction = await storage.createPrediction({
        symbol,
        currentPrice: currentPrice.toFixed(2),
        predictedPrice: predictedPrice.toFixed(2),
        confidence: confidence.toFixed(2),
        direction: change > 0 ? "bullish" : "bearish",
        timeframe: "4h",
      });
      
      res.json(prediction);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate prediction" });
    }
  });

  // Discover tokens from Lisk API and save to DB
  app.post("/api/discover-tokens", async (req, res) => {
    try {
      const LISK_TOKEN_API = "https://api.lisk.bexplorer.com/api/v3/tokens";
      const response = await axios.get(LISK_TOKEN_API);
      const tokens = response.data.data.map((token: any) => ({
        symbol: token.symbol,
        name: token.name,
        address: token.address,
        decimals: token.decimals?.toString() || "18",
      }));
      await upsertTokens(tokens);
      res.json({ success: true, count: tokens.length });
    } catch (error) {
      res.status(500).json({ error: "Failed to discover tokens", details: error.message });
    }
  });

  // List all discovered tokens
  app.get("/api/tokens", async (req, res) => {
    try {
      const tokens = await getAllTokens();
      res.json(tokens);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tokens", details: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
