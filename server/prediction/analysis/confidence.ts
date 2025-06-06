import { SentimentAnalysis } from '../engine';
import { TechnicalAnalysis } from '../engine';
import { z } from 'zod';

// Confidence and Risk Assessment Schema
const ConfidenceAssessmentSchema = z.object({
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

export class ConfidenceAnalyzer {
  private static instance: ConfidenceAnalyzer;

  private constructor() {}

  public static getInstance(): ConfidenceAnalyzer {
    if (!ConfidenceAnalyzer.instance) {
      ConfidenceAnalyzer.instance = new ConfidenceAnalyzer();
    }
    return ConfidenceAnalyzer.instance;
  }

  private calculateTechnicalConfidence(technical: TechnicalAnalysis): number {
    let confidence = 0.5; // Base confidence

    // RSI Analysis
    if (technical.indicators.rsi < 30 || technical.indicators.rsi > 70) {
      confidence += 0.1; // Strong overbought/oversold signals
    }

    // MACD Analysis
    if (
      Math.abs(technical.indicators.macd.histogram) > 0.5 &&
      technical.indicators.macd.value * technical.indicators.macd.signal > 0
    ) {
      confidence += 0.1; // Strong MACD signals
    }

    // Bollinger Bands
    const currentPrice = technical.indicators.volume.current;
    if (
      currentPrice > technical.indicators.bollingerBands.upper ||
      currentPrice < technical.indicators.bollingerBands.lower
    ) {
      confidence += 0.1; // Price outside bands
    }

    // Pattern Recognition
    confidence += technical.patterns.length * 0.05;

    // Trend Strength
    confidence += technical.trend.strength * 0.2;

    return Math.min(Math.max(confidence, 0), 1);
  }

  private calculateSentimentConfidence(sentiment: SentimentAnalysis): number {
    let confidence = 0.5; // Base confidence

    // Social Media Sentiment
    const socialMediaScore =
      (sentiment.socialMedia.reddit.sentiment +
        sentiment.socialMedia.twitter.sentiment +
        sentiment.socialMedia.telegram.sentiment) /
      3;
    confidence += Math.abs(socialMediaScore) * 0.2;

    // News Sentiment
    confidence += Math.abs(sentiment.news.overall) * 0.2;

    // Volume Analysis
    const totalVolume =
      sentiment.socialMedia.reddit.volume +
      sentiment.socialMedia.twitter.volume +
      sentiment.socialMedia.telegram.volume;
    confidence += Math.min(totalVolume / 1000, 0.2);

    return Math.min(Math.max(confidence, 0), 1);
  }

  private calculateRiskScore(
    technical: TechnicalAnalysis,
    sentiment: SentimentAnalysis
  ): { level: 'low' | 'medium' | 'high'; score: number; factors: string[] } {
    let riskScore = 0.5; // Base risk
    const riskFactors: string[] = [];

    // Volatility Risk
    const bbWidth =
      (technical.indicators.bollingerBands.upper -
        technical.indicators.bollingerBands.lower) /
      technical.indicators.bollingerBands.middle;
    if (bbWidth > 0.1) {
      riskScore += 0.2;
      riskFactors.push('high_volatility');
    }

    // Volume Risk
    if (
      technical.indicators.volume.current <
      technical.indicators.volume.average * 0.5
    ) {
      riskScore += 0.1;
      riskFactors.push('low_volume');
    }

    // Sentiment Risk
    if (Math.abs(sentiment.news.overall) > 0.7) {
      riskScore += 0.1;
      riskFactors.push('extreme_sentiment');
    }

    // Pattern Risk
    if (technical.patterns.includes('head_and_shoulders')) {
      riskScore += 0.2;
      riskFactors.push('reversal_pattern');
    }

    // Trend Risk
    if (technical.trend.strength > 0.8) {
      riskScore += 0.1;
      riskFactors.push('strong_trend');
    }

    const level: 'low' | 'medium' | 'high' =
      riskScore < 0.4
        ? 'low'
        : riskScore < 0.7
        ? 'medium'
        : 'high';

    return {
      level,
      score: Math.min(Math.max(riskScore, 0), 1),
      factors: riskFactors,
    };
  }

  private generateSignals(
    technical: TechnicalAnalysis,
    sentiment: SentimentAnalysis
  ): {
    technical: string[];
    sentiment: string[];
    combined: string[];
  } {
    const technicalSignals: string[] = [];
    const sentimentSignals: string[] = [];
    const combinedSignals: string[] = [];

    // Technical Signals
    if (technical.indicators.rsi < 30) technicalSignals.push('oversold');
    if (technical.indicators.rsi > 70) technicalSignals.push('overbought');
    if (technical.indicators.macd.histogram > 0) technicalSignals.push('macd_bullish');
    if (technical.indicators.macd.histogram < 0) technicalSignals.push('macd_bearish');
    technical.patterns.forEach(pattern => technicalSignals.push(pattern));

    // Sentiment Signals
    if (sentiment.news.overall > 0.5) sentimentSignals.push('positive_news');
    if (sentiment.news.overall < -0.5) sentimentSignals.push('negative_news');
    if (sentiment.socialMedia.reddit.trending) sentimentSignals.push('reddit_trending');
    if (sentiment.socialMedia.twitter.trending) sentimentSignals.push('twitter_trending');

    // Combined Signals
    if (
      technical.trend.direction === 'bullish' &&
      sentiment.news.overall > 0.3
    ) {
      combinedSignals.push('bullish_alignment');
    }
    if (
      technical.trend.direction === 'bearish' &&
      sentiment.news.overall < -0.3
    ) {
      combinedSignals.push('bearish_alignment');
    }

    return {
      technical: technicalSignals,
      sentiment: sentimentSignals,
      combined: combinedSignals,
    };
  }

  private generateRecommendation(
    technical: TechnicalAnalysis,
    sentiment: SentimentAnalysis,
    confidence: number,
    risk: { level: 'low' | 'medium' | 'high'; score: number }
  ): {
    action: 'buy' | 'sell' | 'hold';
    strength: number;
    timeframe: string;
  } {
    let action: 'buy' | 'sell' | 'hold' = 'hold';
    let strength = 0;
    let timeframe = 'short_term';

    // Determine action based on technical and sentiment alignment
    const technicalDirection = technical.trend.direction;
    const sentimentDirection =
      sentiment.news.overall > 0.3
        ? 'bullish'
        : sentiment.news.overall < -0.3
        ? 'bearish'
        : 'neutral';

    if (technicalDirection === sentimentDirection) {
      action = technicalDirection === 'bullish' ? 'buy' : 'sell';
      strength = confidence * (1 - risk.score);
    }

    // Adjust timeframe based on pattern and trend strength
    if (technical.patterns.includes('head_and_shoulders')) {
      timeframe = 'long_term';
    } else if (technical.trend.strength > 0.7) {
      timeframe = 'medium_term';
    }

    return {
      action,
      strength: Math.min(Math.max(strength, 0), 1),
      timeframe,
    };
  }

  async analyzeConfidence(
    technical: TechnicalAnalysis,
    sentiment: SentimentAnalysis
  ) {
    try {
      const technicalConfidence = this.calculateTechnicalConfidence(technical);
      const sentimentConfidence = this.calculateSentimentConfidence(sentiment);
      const confidence = (technicalConfidence + sentimentConfidence) / 2;

      const risk = this.calculateRiskScore(technical, sentiment);
      const signals = this.generateSignals(technical, sentiment);
      const recommendation = this.generateRecommendation(
        technical,
        sentiment,
        confidence,
        risk
      );

      const assessment = {
        confidence,
        risk,
        signals,
        recommendation,
      };

      return ConfidenceAssessmentSchema.parse(assessment);
    } catch (error) {
      console.error('Error in confidence analysis:', error);
      throw error;
    }
  }
} 