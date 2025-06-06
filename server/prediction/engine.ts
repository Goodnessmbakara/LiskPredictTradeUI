import { z } from 'zod';
import { SentimentAnalyzer } from './sentiment/analyzer';
import { TechnicalAnalyzer } from './technical/analyzer';
import { ConfidenceAnalyzer } from './analysis/confidence';

// Types for different analysis components
export interface TechnicalAnalysis {
  priceAction: {
    trend: 'bullish' | 'bearish' | 'neutral';
    strength: number; // 0-100
    patterns: string[];
  };
  indicators: {
    rsi: number;
    macd: {
      value: number;
      signal: number;
      histogram: number;
    };
    movingAverages: {
      sma20: number;
      sma50: number;
      sma200: number;
    };
  };
  volume: {
    current: number;
    average: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
}

export interface SentimentAnalysis {
  socialMedia: {
    twitter: {
      sentiment: number; // -1 to 1
      volume: number;
      trending: boolean;
    };
    reddit: {
      sentiment: number;
      volume: number;
      trending: boolean;
    };
    telegram: {
      sentiment: number;
      volume: number;
      trending: boolean;
    };
  };
  news: {
    overall: number;
    sources: {
      [key: string]: {
        sentiment: number;
        volume: number;
      };
    };
  };
  onChain: {
    whaleMovements: {
      largeTransactions: number;
      netFlow: number;
    };
    exchangeFlows: {
      inflow: number;
      outflow: number;
    };
    networkActivity: {
      transactions: number;
      activeAddresses: number;
    };
  };
}

export interface MarketPsychology {
  fearGreedIndex: number;
  marketSentiment: number;
  liquidity: {
    depth: number;
    spread: number;
  };
  manipulationRisk: number;
}

export interface SocialMetrics {
  developerActivity: {
    commits: number;
    contributors: number;
    activeRepos: number;
  };
  community: {
    growth: number;
    engagement: number;
    influencerImpact: number;
  };
}

export interface PredictionResult {
  symbol: string;
  timestamp: Date;
  prediction: {
    direction: 'up' | 'down' | 'neutral';
    confidence: number;
    timeframe: string;
    targetPrice: number;
  };
  analysis: {
    technical: TechnicalAnalysis;
    sentiment: SentimentAnalysis;
    market: MarketPsychology;
    social: SocialMetrics;
  };
  riskAssessment: {
    overall: number;
    factors: {
      [key: string]: number;
    };
  };
}

// Technical Analysis Schema
export const TechnicalAnalysisSchema = z.object({
  indicators: z.object({
    rsi: z.number(),
    macd: z.object({
      value: z.number(),
      signal: z.number(),
      histogram: z.number(),
    }),
    bollingerBands: z.object({
      upper: z.number(),
      middle: z.number(),
      lower: z.number(),
    }),
    volume: z.object({
      current: z.number(),
      average: z.number(),
      trend: z.number(),
    }),
  }),
  patterns: z.array(z.string()),
  support: z.array(z.number()),
  resistance: z.array(z.number()),
  trend: z.object({
    direction: z.enum(['bullish', 'bearish', 'neutral']),
    strength: z.number(),
  }),
});

// Sentiment Analysis Schema
export const SentimentAnalysisSchema = z.object({
  socialMedia: z.object({
    reddit: z.object({
      sentiment: z.number(),
      volume: z.number(),
      trending: z.boolean(),
    }),
    twitter: z.object({
      sentiment: z.number(),
      volume: z.number(),
      trending: z.boolean(),
    }),
    telegram: z.object({
      sentiment: z.number(),
      volume: z.number(),
      trending: z.boolean(),
    }),
  }),
  news: z.object({
    overall: z.number(),
    sources: z.record(
      z.string(),
      z.object({
        sentiment: z.number(),
        volume: z.number(),
      })
    ),
  }),
  onChain: z.object({
    whaleMovements: z.object({
      largeTransactions: z.number(),
      netFlow: z.number(),
    }),
    exchangeFlows: z.object({
      inflow: z.number(),
      outflow: z.number(),
    }),
    networkActivity: z.object({
      transactions: z.number(),
      activeAddresses: z.number(),
    }),
  }),
});

// Confidence Assessment Schema
export const ConfidenceAssessmentSchema = z.object({
  confidence: z.number(),
  risk: z.object({
    level: z.enum(['low', 'medium', 'high']),
    score: z.number(),
    factors: z.array(z.string()),
  }),
  signals: z.object({
    technical: z.array(z.string()),
    sentiment: z.array(z.string()),
    combined: z.array(z.string()),
  }),
  recommendation: z.object({
    action: z.enum(['buy', 'sell', 'hold']),
    strength: z.number(),
    timeframe: z.string(),
  }),
});

// Prediction Schema
export const PredictionSchema = z.object({
  symbol: z.string(),
  timestamp: z.number(),
  technical: TechnicalAnalysisSchema,
  sentiment: SentimentAnalysisSchema,
  confidence: ConfidenceAssessmentSchema,
  price: z.object({
    current: z.number(),
    prediction: z.object({
      shortTerm: z.number(),
      mediumTerm: z.number(),
      longTerm: z.number(),
    }),
  }),
});

export type TechnicalAnalysis = z.infer<typeof TechnicalAnalysisSchema>;
export type SentimentAnalysis = z.infer<typeof SentimentAnalysisSchema>;
export type ConfidenceAssessment = z.infer<typeof ConfidenceAssessmentSchema>;
export type Prediction = z.infer<typeof PredictionSchema>;

export class PredictionEngine {
  private static instance: PredictionEngine;
  private sentimentAnalyzer: SentimentAnalyzer;
  private technicalAnalyzer: TechnicalAnalyzer;
  private confidenceAnalyzer: ConfidenceAnalyzer;

  private constructor() {
    this.sentimentAnalyzer = SentimentAnalyzer.getInstance();
    this.technicalAnalyzer = TechnicalAnalyzer.getInstance();
    this.confidenceAnalyzer = ConfidenceAnalyzer.getInstance();
  }

  public static getInstance(): PredictionEngine {
    if (!PredictionEngine.instance) {
      PredictionEngine.instance = new PredictionEngine();
    }
    return PredictionEngine.instance;
  }

  private calculatePricePrediction(
    technical: TechnicalAnalysis,
    sentiment: SentimentAnalysis,
    confidence: ConfidenceAssessment,
    currentPrice: number
  ) {
    const { recommendation } = confidence;
    const { trend } = technical;
    const sentimentScore = sentiment.news.overall;

    // Calculate price movement based on technical and sentiment factors
    const technicalFactor = trend.strength * (trend.direction === 'bullish' ? 1 : -1);
    const sentimentFactor = sentimentScore * 0.5;
    const confidenceFactor = confidence.confidence * (recommendation.action === 'buy' ? 1 : -1);

    // Combine factors with weights
    const movementFactor = (
      technicalFactor * 0.4 +
      sentimentFactor * 0.3 +
      confidenceFactor * 0.3
    );

    // Calculate predictions for different timeframes
    const shortTerm = currentPrice * (1 + movementFactor * 0.05);
    const mediumTerm = currentPrice * (1 + movementFactor * 0.15);
    const longTerm = currentPrice * (1 + movementFactor * 0.3);

    return {
      shortTerm,
      mediumTerm,
      longTerm,
    };
  }

  async generatePrediction(
    symbol: string,
    currentPrice: number,
    historicalPrices: number[]
  ): Promise<Prediction> {
    try {
      // Run analyses in parallel
      const [sentiment, technical] = await Promise.all([
        this.sentimentAnalyzer.analyzeSentiment(symbol),
        this.technicalAnalyzer.analyzeTechnical(symbol, historicalPrices),
      ]);

      // Generate confidence assessment
      const confidence = await this.confidenceAnalyzer.analyzeConfidence(
        technical,
        sentiment
      );

      // Calculate price predictions
      const prediction = this.calculatePricePrediction(
        technical,
        sentiment,
        confidence,
        currentPrice
      );

      const result: Prediction = {
        symbol,
        timestamp: Date.now(),
        technical,
        sentiment,
        confidence,
        price: {
          current: currentPrice,
          prediction,
        },
      };

      return PredictionSchema.parse(result);
    } catch (error) {
      console.error('Error generating prediction:', error);
      throw error;
    }
  }

  async refreshAnalysis(symbol: string): Promise<void> {
    try {
      await Promise.all([
        this.sentimentAnalyzer.refreshCache(symbol),
        // Add technical analysis cache refresh when implemented
      ]);
    } catch (error) {
      console.error('Error refreshing analysis:', error);
      throw error;
    }
  }
} 