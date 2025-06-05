import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  walletAddress: text("wallet_address").unique(),
  balance: decimal("balance", { precision: 18, scale: 8 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  currentPrice: decimal("current_price", { precision: 18, scale: 8 }).notNull(),
  predictedPrice: decimal("predicted_price", { precision: 18, scale: 8 }).notNull(),
  confidence: decimal("confidence", { precision: 5, scale: 2 }).notNull(),
  direction: text("direction").notNull(), // 'bullish', 'bearish', 'neutral'
  timeframe: text("timeframe").notNull(), // '1h', '4h', '24h'
  createdAt: timestamp("created_at").defaultNow(),
});

export const trades = pgTable("trades", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  symbol: text("symbol").notNull(),
  type: text("type").notNull(), // 'buy', 'sell'
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  price: decimal("price", { precision: 18, scale: 8 }).notNull(),
  pnl: decimal("pnl", { precision: 18, scale: 8 }).default("0"),
  isAutoTrade: boolean("is_auto_trade").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sentiment = pgTable("sentiment", {
  id: serial("id").primaryKey(),
  source: text("source").notNull(), // 'news', 'social', 'onchain'
  symbol: text("symbol").notNull(),
  score: decimal("score", { precision: 5, scale: 2 }).notNull(), // -1 to 1
  confidence: decimal("confidence", { precision: 5, scale: 2 }).notNull(),
  title: text("title"),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const portfolios = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  totalValue: decimal("total_value", { precision: 18, scale: 8 }).notNull(),
  dailyChange: decimal("daily_change", { precision: 18, scale: 8 }).notNull(),
  dailyChangePercent: decimal("daily_change_percent", { precision: 5, scale: 2 }).notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertPredictionSchema = createInsertSchema(predictions).omit({ id: true, createdAt: true });
export const insertTradeSchema = createInsertSchema(trades).omit({ id: true, createdAt: true });
export const insertSentimentSchema = createInsertSchema(sentiment).omit({ id: true, createdAt: true });
export const insertPortfolioSchema = createInsertSchema(portfolios).omit({ id: true, updatedAt: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type InsertTrade = z.infer<typeof insertTradeSchema>;
export type InsertSentiment = z.infer<typeof insertSentimentSchema>;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;

export type User = typeof users.$inferSelect;
export type Prediction = typeof predictions.$inferSelect;
export type Trade = typeof trades.$inferSelect;
export type Sentiment = typeof sentiment.$inferSelect;
export type Portfolio = typeof portfolios.$inferSelect;
