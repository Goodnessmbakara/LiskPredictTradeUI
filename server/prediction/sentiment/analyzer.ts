import { SentimentAnalysis } from '../engine';
import { z } from 'zod';
import { SentimentCache } from './cache';
import { NLPProcessor } from './nlp';

// API keys and configuration would be stored in environment variables
const CRYPTOPANIC_API_KEY = process.env.CRYPTOPANIC_API_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const COVALENT_API_KEY = process.env.COVALENT_API_KEY;

// Cache TTLs in seconds
const CACHE_TTL = {
  REDDIT: 300,    // 5 minutes
  NEWS: 300,      // 5 minutes
  ONCHAIN: 60,    // 1 minute
};

export class SentimentAnalyzer {
  private static instance: SentimentAnalyzer;
  private cache: SentimentCache;
  private nlp: NLPProcessor;

  private constructor() {
    this.cache = SentimentCache.getInstance();
    this.nlp = NLPProcessor.getInstance();
  }

  public static getInstance(): SentimentAnalyzer {
    if (!SentimentAnalyzer.instance) {
      SentimentAnalyzer.instance = new SentimentAnalyzer();
    }
    return SentimentAnalyzer.instance;
  }

  async analyzeReddit(symbol: string): Promise<SentimentAnalysis['socialMedia']['reddit']> {
    try {
      // Check cache first
      const cachedData = await this.cache.getCachedSentiment(symbol, 'reddit');
      if (cachedData) {
        return cachedData;
      }

      const response = await fetch(
        `https://www.reddit.com/r/cryptocurrency/search.json?q=${symbol}&sort=hot&limit=100`
      );
      const data = await response.json();
      
      const posts = data.data.children;
      const postTexts = posts.map((post: any) => post.data.title + ' ' + post.data.selftext);
      
      // Analyze sentiment using NLP
      const sentimentAnalysis = await this.nlp.analyzeBatch(postTexts);
      
      const result = {
        sentiment: sentimentAnalysis.overallSentiment,
        volume: posts.length,
        trending: sentimentAnalysis.trendingTopics.length > 0,
      };

      // Cache the result
      await this.cache.setCachedSentiment(symbol, 'reddit', result, CACHE_TTL.REDDIT);

      return result;
    } catch (error) {
      console.error('Error analyzing Reddit sentiment:', error);
      throw error;
    }
  }

  async analyzeNews(symbol: string): Promise<SentimentAnalysis['news']> {
    try {
      // Check cache first
      const cachedData = await this.cache.getCachedSentiment(symbol, 'news');
      if (cachedData) {
        return cachedData;
      }

      const response = await fetch(
        `https://cryptopanic.com/api/v1/posts/?auth_token=${CRYPTOPANIC_API_KEY}&currencies=${symbol}&kind=news`
      );
      const data = await response.json();
      
      const news = data.results;
      const newsTexts = news.map((item: any) => item.title + ' ' + item.description);
      
      // Analyze sentiment using NLP
      const sentimentAnalysis = await this.nlp.analyzeBatch(newsTexts);
      
      const sources: { [key: string]: { sentiment: number; volume: number } } = {};
      news.forEach((item: any) => {
        const source = item.source.title;
        if (!sources[source]) {
          sources[source] = { sentiment: 0, volume: 0 };
        }
        sources[source].volume += 1;
      });

      const result = {
        overall: sentimentAnalysis.overallSentiment,
        sources,
      };

      // Cache the result
      await this.cache.setCachedSentiment(symbol, 'news', result, CACHE_TTL.NEWS);

      return result;
    } catch (error) {
      console.error('Error analyzing news sentiment:', error);
      throw error;
    }
  }

  async analyzeOnChain(symbol: string): Promise<SentimentAnalysis['onChain']> {
    try {
      // Check cache first
      const cachedData = await this.cache.getCachedSentiment(symbol, 'onchain');
      if (cachedData) {
        return cachedData;
      }

      const response = await fetch(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${symbol}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`
      );
      const data = await response.json();
      
      const transactions = data.result;
      const largeTransactions = transactions.filter((tx: any) => 
        parseFloat(tx.value) > 1000000000000000000
      ).length;

      const netFlow = transactions.reduce((acc: number, tx: any) => {
        return acc + (tx.from === symbol ? -parseFloat(tx.value) : parseFloat(tx.value));
      }, 0);

      const covalentResponse = await fetch(
        `https://api.covalenthq.com/v1/1/address/${symbol}/transactions_v2/?key=${COVALENT_API_KEY}`
      );
      const covalentData = await covalentResponse.json();

      const exchangeFlows = {
        inflow: 0,
        outflow: 0,
      };

      covalentData.data.items.forEach((tx: any) => {
        if (tx.to_address === symbol) {
          exchangeFlows.inflow += parseFloat(tx.value);
        } else {
          exchangeFlows.outflow += parseFloat(tx.value);
        }
      });

      const result = {
        whaleMovements: {
          largeTransactions,
          netFlow,
        },
        exchangeFlows,
        networkActivity: {
          transactions: transactions.length,
          activeAddresses: new Set(transactions.map((tx: any) => tx.from)).size,
        },
      };

      // Cache the result
      await this.cache.setCachedSentiment(symbol, 'onchain', result, CACHE_TTL.ONCHAIN);

      return result;
    } catch (error) {
      console.error('Error analyzing on-chain data:', error);
      throw error;
    }
  }

  async analyzeSentiment(symbol: string): Promise<SentimentAnalysis> {
    try {
      const [
        redditAnalysis,
        newsAnalysis,
        onChainAnalysis,
      ] = await Promise.all([
        this.analyzeReddit(symbol),
        this.analyzeNews(symbol),
        this.analyzeOnChain(symbol),
      ]);

      return {
        socialMedia: {
          reddit: redditAnalysis,
          twitter: { sentiment: 0, volume: 0, trending: false },
          telegram: { sentiment: 0, volume: 0, trending: false },
        },
        news: newsAnalysis,
        onChain: onChainAnalysis,
      };
    } catch (error) {
      console.error('Error in sentiment analysis:', error);
      throw error;
    }
  }

  // Method to force refresh cache for a symbol
  async refreshCache(symbol: string, type?: 'reddit' | 'news' | 'onchain'): Promise<void> {
    await this.cache.invalidateCache(symbol, type);
  }

  // Method to get cache statistics
  async getCacheStats() {
    return this.cache.getStats();
  }
} 