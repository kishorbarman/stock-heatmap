import type { StockQuote } from '../types';

interface YahooQuoteResult {
  symbol: string;
  shortName?: string;
  longName?: string;
  regularMarketPrice: number;
  regularMarketChangePercent?: number;
  regularMarketChange?: number;
  marketCap?: number;
}

async function fetchQuoteChunk(symbols: string[]): Promise<StockQuote[]> {
  const params = new URLSearchParams({ symbols: symbols.join(',') });
  const response = await fetch(`/api/quotes?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Yahoo Finance API error: ${response.status}`);
  }

  const data = await response.json();
  const quotes: YahooQuoteResult[] = data?.quoteResponse?.result ?? [];

  return quotes.map(
    (q): StockQuote => ({
      symbol: q.symbol,
      name: q.longName ?? q.shortName ?? q.symbol,
      price: q.regularMarketPrice ?? 0,
      changesPercentage: q.regularMarketChangePercent ?? 0,
      change: q.regularMarketChange ?? 0,
      marketCap: q.marketCap ?? 0,
      volume: 0,
      exchange: '',
      timestamp: 0,
    })
  );
}

export async function fetchBatchQuotes(symbols: string[]): Promise<StockQuote[]> {
  // Split into chunks to keep URLs reasonable.
  const chunkSize = 200;
  const retryChunkSize = 25;
  const chunks: string[][] = [];
  for (let i = 0; i < symbols.length; i += chunkSize) {
    chunks.push(symbols.slice(i, i + chunkSize));
  }

  const results = await Promise.all(
    chunks.map(async (chunk) => {
      const initialQuotes = await fetchQuoteChunk(chunk);
      const quoteMap = new Map(initialQuotes.map((q) => [q.symbol, q]));

      // Yahoo occasionally returns partial results for large batches.
      const missing = chunk.filter((symbol) => !quoteMap.has(symbol));
      if (missing.length === 0) {
        return initialQuotes;
      }

      for (let i = 0; i < missing.length; i += retryChunkSize) {
        const retrySymbols = missing.slice(i, i + retryChunkSize);
        const retryQuotes = await fetchQuoteChunk(retrySymbols);
        for (const quote of retryQuotes) {
          quoteMap.set(quote.symbol, quote);
        }
      }

      return Array.from(quoteMap.values());
    })
  );

  return results.flat();
}
