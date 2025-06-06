import { z } from 'zod';
import { TechnicalAnalysis } from '../engine';

// Technical Analysis Schema
const TechnicalAnalysisSchema = z.object({
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

export class TechnicalAnalyzer {
  private static instance: TechnicalAnalyzer;

  private constructor() {}

  public static getInstance(): TechnicalAnalyzer {
    if (!TechnicalAnalyzer.instance) {
      TechnicalAnalyzer.instance = new TechnicalAnalyzer();
    }
    return TechnicalAnalyzer.instance;
  }

  private calculateRSI(prices: number[], period: number = 14): number {
    let gains = 0;
    let losses = 0;

    for (let i = 1; i < period + 1; i++) {
      const difference = prices[i] - prices[i - 1];
      if (difference >= 0) {
        gains += difference;
      } else {
        losses -= difference;
      }
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  private calculateMACD(prices: number[]): { value: number; signal: number; histogram: number } {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    const macdLine = ema12 - ema26;
    const signalLine = this.calculateEMA([macdLine], 9);
    const histogram = macdLine - signalLine;

    return {
      value: macdLine,
      signal: signalLine,
      histogram,
    };
  }

  private calculateEMA(prices: number[], period: number): number {
    const multiplier = 2 / (period + 1);
    let ema = prices[0];

    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] - ema) * multiplier + ema;
    }

    return ema;
  }

  private calculateBollingerBands(prices: number[], period: number = 20): {
    upper: number;
    middle: number;
    lower: number;
  } {
    const sma = prices.slice(0, period).reduce((a, b) => a + b) / period;
    const squaredDifferences = prices
      .slice(0, period)
      .map(price => Math.pow(price - sma, 2));
    const standardDeviation = Math.sqrt(
      squaredDifferences.reduce((a, b) => a + b) / period
    );

    return {
      upper: sma + 2 * standardDeviation,
      middle: sma,
      lower: sma - 2 * standardDeviation,
    };
  }

  private detectPatterns(prices: number[]): string[] {
    const patterns: string[] = [];

    // Double Top/Bottom
    if (this.isDoubleTop(prices)) patterns.push('double_top');
    if (this.isDoubleBottom(prices)) patterns.push('double_bottom');

    // Head and Shoulders
    if (this.isHeadAndShoulders(prices)) patterns.push('head_and_shoulders');

    // Triangle Patterns
    if (this.isAscendingTriangle(prices)) patterns.push('ascending_triangle');
    if (this.isDescendingTriangle(prices)) patterns.push('descending_triangle');

    return patterns;
  }

  private isDoubleTop(prices: number[]): boolean {
    // Implementation of double top pattern detection
    return false; // Placeholder
  }

  private isDoubleBottom(prices: number[]): boolean {
    // Implementation of double bottom pattern detection
    return false; // Placeholder
  }

  private isHeadAndShoulders(prices: number[]): boolean {
    // Implementation of head and shoulders pattern detection
    return false; // Placeholder
  }

  private isAscendingTriangle(prices: number[]): boolean {
    // Implementation of ascending triangle pattern detection
    return false; // Placeholder
  }

  private isDescendingTriangle(prices: number[]): boolean {
    // Implementation of descending triangle pattern detection
    return false; // Placeholder
  }

  private findSupportResistance(prices: number[]): {
    support: number[];
    resistance: number[];
  } {
    const levels = new Set<number>();
    const support: number[] = [];
    const resistance: number[] = [];

    // Find local minima and maxima
    for (let i = 2; i < prices.length - 2; i++) {
      if (
        prices[i] < prices[i - 1] &&
        prices[i] < prices[i - 2] &&
        prices[i] < prices[i + 1] &&
        prices[i] < prices[i + 2]
      ) {
        support.push(prices[i]);
      }
      if (
        prices[i] > prices[i - 1] &&
        prices[i] > prices[i - 2] &&
        prices[i] > prices[i + 1] &&
        prices[i] > prices[i + 2]
      ) {
        resistance.push(prices[i]);
      }
    }

    return { support, resistance };
  }

  private determineTrend(prices: number[]): {
    direction: 'bullish' | 'bearish' | 'neutral';
    strength: number;
  } {
    const sma20 = this.calculateEMA(prices, 20);
    const sma50 = this.calculateEMA(prices, 50);
    const currentPrice = prices[prices.length - 1];

    let direction: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    let strength = 0;

    if (currentPrice > sma20 && sma20 > sma50) {
      direction = 'bullish';
      strength = (currentPrice - sma50) / sma50;
    } else if (currentPrice < sma20 && sma20 < sma50) {
      direction = 'bearish';
      strength = (sma50 - currentPrice) / sma50;
    }

    return { direction, strength: Math.min(Math.abs(strength), 1) };
  }

  async analyzeTechnical(symbol: string, prices: number[]): Promise<TechnicalAnalysis> {
    try {
      const rsi = this.calculateRSI(prices);
      const macd = this.calculateMACD(prices);
      const bollingerBands = this.calculateBollingerBands(prices);
      const patterns = this.detectPatterns(prices);
      const { support, resistance } = this.findSupportResistance(prices);
      const trend = this.determineTrend(prices);

      const volume = {
        current: prices[prices.length - 1],
        average: prices.reduce((a, b) => a + b) / prices.length,
        trend: (prices[prices.length - 1] - prices[0]) / prices[0],
      };

      const analysis: TechnicalAnalysis = {
        indicators: {
          rsi,
          macd,
          bollingerBands,
          volume,
        },
        patterns,
        support,
        resistance,
        trend,
      };

      return TechnicalAnalysisSchema.parse(analysis);
    } catch (error) {
      console.error('Error in technical analysis:', error);
      throw error;
    }
  }
} 