import { useState, useCallback } from 'react';
import { fetchBatchQuotes } from '../api/fmp';
import constituents from '../data/sp500-constituents.json';
import type { StockData, DataState, SP500Constituent } from '../types';

// For dual-class stocks, keep the non-voting share class
const EXCLUDED_VOTING_CLASSES = new Set(['GOOGL', 'FOXA', 'NWSA']);

export function useStockData() {
  const [state, setState] = useState<DataState>({ status: 'idle' });

  const fetchData = useCallback(async () => {
    setState({ status: 'loading' });
    try {
      const typedConstituents = (constituents as SP500Constituent[]).filter(
        (c) => !EXCLUDED_VOTING_CLASSES.has(c.symbol)
      );
      const symbols = typedConstituents.map((c) => c.symbol);
      const quotes = await fetchBatchQuotes(symbols);

      const quoteMap = new Map(quotes.map((q) => [q.symbol, q]));

      const stocks: StockData[] = typedConstituents
        .map((c) => {
          const quote = quoteMap.get(c.symbol);
          if (!quote) return null;
          return {
            symbol: c.symbol,
            name: c.name,
            sector: c.sector,
            subIndustry: c.subIndustry,
            exchange: c.exchange,
            price: quote.price,
            changesPercentage: quote.changesPercentage,
            marketCap: quote.marketCap,
          };
        })
        .filter((s): s is StockData => s !== null && s.marketCap > 0);

      setState({ status: 'success', data: stocks, timestamp: new Date() });
    } catch (err) {
      setState({
        status: 'error',
        error: err instanceof Error ? err.message : 'Failed to fetch stock data',
      });
    }
  }, []);

  return { state, fetchData };
}
