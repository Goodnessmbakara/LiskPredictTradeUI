import { pgTable, serial, text, timestamp, numeric, boolean, jsonb } from 'drizzle-orm/pg-core';

// Predictions table
export const predictions = pgTable('predictions', {
  id: serial('id').primaryKey(),
  symbol: text('symbol').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  currentPrice: numeric('current_price').notNull(),
  technicalAnalysis: jsonb('technical_analysis').notNull(),
  sentimentAnalysis: jsonb('sentiment_analysis').notNull(),
  confidenceAssessment: jsonb('confidence_assessment').notNull(),
  pricePrediction: jsonb('price_prediction').notNull(),
  isAccurate: boolean('is_accurate'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Historical Prices table
export const historicalPrices = pgTable('historical_prices', {
  id: serial('id').primaryKey(),
  symbol: text('symbol').notNull(),
  timestamp: timestamp('timestamp').notNull(),
  price: numeric('price').notNull(),
  volume: numeric('volume').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Sentiment Data table
export const sentimentData = pgTable('sentiment_data', {
  id: serial('id').primaryKey(),
  symbol: text('symbol').notNull(),
  source: text('source').notNull(), // 'reddit', 'twitter', 'news', etc.
  content: text('content').notNull(),
  sentiment: numeric('sentiment').notNull(),
  timestamp: timestamp('timestamp').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Technical Indicators table
export const technicalIndicators = pgTable('technical_indicators', {
  id: serial('id').primaryKey(),
  symbol: text('symbol').notNull(),
  timestamp: timestamp('timestamp').notNull(),
  rsi: numeric('rsi'),
  macd: jsonb('macd'),
  bollingerBands: jsonb('bollinger_bands'),
  volume: jsonb('volume'),
  patterns: jsonb('patterns'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Risk Assessments table
export const riskAssessments = pgTable('risk_assessments', {
  id: serial('id').primaryKey(),
  symbol: text('symbol').notNull(),
  timestamp: timestamp('timestamp').notNull(),
  riskLevel: text('risk_level').notNull(), // 'low', 'medium', 'high'
  riskScore: numeric('risk_score').notNull(),
  riskFactors: jsonb('risk_factors').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Performance Metrics table
export const performanceMetrics = pgTable('performance_metrics', {
  id: serial('id').primaryKey(),
  symbol: text('symbol').notNull(),
  timestamp: timestamp('timestamp').notNull(),
  predictionAccuracy: numeric('prediction_accuracy'),
  sentimentAccuracy: numeric('sentiment_accuracy'),
  technicalAccuracy: numeric('technical_accuracy'),
  riskAssessmentAccuracy: numeric('risk_assessment_accuracy'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}); 