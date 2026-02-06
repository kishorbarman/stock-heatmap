import type { StockQuote } from '../types';

interface YahooQuoteResult {
  symbol: string;
  shortName?: string;
  longName?: string;
  regularMarketPrice: number;
  regularMarketChangePercent: number;
  regularMarketChange: number;
  marketCap: number;
}

export async function fetchBatchQuotes(symbols: string[]): Promise<StockQuote[]> {
  // Split into chunks of ~200 to keep URLs reasonable
  const chunkSize = 200;
  const chunks: string[][] = [];
  for (let i = 0; i < symbols.length; i += chunkSize) {
    chunks.push(symbols.slice(i, i + chunkSize));
  }

  const results = await Promise.all(
    chunks.map(async (chunk) => {
      const symbolList = chunk.join(',');
      const response = await fetch(`/api/quotes?symbols=${symbolList}`);
      if (!response.ok) {
        throw new Error(`Yahoo Finance API error: ${response.status}`);
      }
      const data = await response.json();

      const quotes: YahooQuoteResult[] =
        data?.quoteResponse?.result ?? [];

      return quotes.map(
        (q): StockQuote => ({
          symbol: q.symbol,
          name: q.longName ?? q.shortName ?? q.symbol,
          price: q.regularMarketPrice,
          changesPercentage: q.regularMarketChangePercent,
          change: q.regularMarketChange,
          marketCap: q.marketCap,
          volume: 0,
          exchange: '',
          timestamp: 0,
        })
      );
    })
  );

  return results.flat();
}
