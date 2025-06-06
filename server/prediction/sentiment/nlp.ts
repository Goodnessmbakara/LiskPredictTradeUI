import natural from 'natural';
import { SentimentAnalysis } from '../engine';

// Initialize NLP tools
const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();

// Crypto-specific sentiment words
const CRYPTO_SENTIMENT_WORDS = {
  positive: [
    'bullish', 'moon', 'hodl', 'diamond hands', 'accumulate', 'breakout',
    'rally', 'surge', 'gain', 'profit', 'growth', 'adoption', 'partnership',
    'development', 'upgrade', 'innovation', 'potential', 'opportunity'
  ],
  negative: [
    'bearish', 'dump', 'sell', 'fud', 'scam', 'rug', 'manipulation',
    'crash', 'dump', 'loss', 'risk', 'concern', 'warning', 'caution',
    'regulation', 'ban', 'hack', 'vulnerability'
  ],
  neutral: [
    'consolidation', 'sideways', 'range', 'support', 'resistance',
    'volume', 'liquidity', 'market', 'trend', 'analysis', 'technical',
    'fundamental', 'chart', 'pattern'
  ]
};

export class NLPProcessor {
  private static instance: NLPProcessor;
  private sentimentAnalyzer: natural.SentimentAnalyzer;

  private constructor() {
    // Initialize sentiment analyzer with custom vocabulary
    this.sentimentAnalyzer = new natural.SentimentAnalyzer(
      'English',
      natural.PorterStemmer,
      'afinn'
    );
  }

  public static getInstance(): NLPProcessor {
    if (!NLPProcessor.instance) {
      NLPProcessor.instance = new NLPProcessor();
    }
    return NLPProcessor.instance;
  }

  private preprocessText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' ')    // Normalize whitespace
      .trim();
  }

  private extractKeywords(text: string): string[] {
    const tokens = tokenizer.tokenize(text);
    if (!tokens) return [];

    // Add document to TF-IDF
    tfidf.addDocument(tokens);

    // Get top keywords
    const keywords = new Set<string>();
    tfidf.listTerms(0).slice(0, 10).forEach(item => {
      keywords.add(item.term);
    });

    return Array.from(keywords);
  }

  private analyzeCryptoContext(text: string): number {
    let score = 0;
    const words = text.toLowerCase().split(' ');

    // Check for crypto-specific sentiment words
    CRYPTO_SENTIMENT_WORDS.positive.forEach(word => {
      if (text.includes(word)) score += 0.2;
    });

    CRYPTO_SENTIMENT_WORDS.negative.forEach(word => {
      if (text.includes(word)) score -= 0.2;
    });

    return Math.max(-1, Math.min(1, score));
  }

  private detectTrendingTopics(texts: string[]): string[] {
    const wordFrequency: { [key: string]: number } = {};
    
    texts.forEach(text => {
      const words = this.preprocessText(text).split(' ');
      words.forEach(word => {
        if (word.length > 3) { // Ignore short words
          wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        }
      });
    });

    // Get top trending words
    return Object.entries(wordFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }

  async analyzeSentiment(text: string): Promise<{
    score: number;
    keywords: string[];
    cryptoContext: number;
  }> {
    const preprocessedText = this.preprocessText(text);
    const tokens = tokenizer.tokenize(preprocessedText);

    // Get base sentiment score
    const baseScore = this.sentimentAnalyzer.getSentiment(tokens);

    // Get crypto-specific context
    const cryptoContext = this.analyzeCryptoContext(preprocessedText);

    // Extract keywords
    const keywords = this.extractKeywords(preprocessedText);

    // Combine scores with weights
    const finalScore = (baseScore * 0.6) + (cryptoContext * 0.4);

    return {
      score: Math.max(-1, Math.min(1, finalScore)),
      keywords,
      cryptoContext,
    };
  }

  async analyzeBatch(texts: string[]): Promise<{
    overallSentiment: number;
    trendingTopics: string[];
    keywordFrequency: { [key: string]: number };
  }> {
    const sentiments = await Promise.all(
      texts.map(text => this.analyzeSentiment(text))
    );

    // Calculate overall sentiment
    const overallSentiment = sentiments.reduce(
      (acc, curr) => acc + curr.score,
      0
    ) / sentiments.length;

    // Get trending topics
    const trendingTopics = this.detectTrendingTopics(texts);

    // Calculate keyword frequency
    const keywordFrequency: { [key: string]: number } = {};
    sentiments.forEach(sentiment => {
      sentiment.keywords.forEach(keyword => {
        keywordFrequency[keyword] = (keywordFrequency[keyword] || 0) + 1;
      });
    });

    return {
      overallSentiment: Math.max(-1, Math.min(1, overallSentiment)),
      trendingTopics,
      keywordFrequency,
    };
  }
} 