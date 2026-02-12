import { useState, useCallback, useRef } from 'react';
import { fetchBatchQuotes } from '../api/fmp';
import type { StockData, DataState, MarketIndexConfig } from '../types';
import { getQuoteSymbol } from '../data/indexConfigs';

export function useStockData(indexConfig: MarketIndexConfig) {
  const [state, setState] = useState<DataState>({ status: 'idle' });
  const requestIdRef = useRef(0);

  const fetchData = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setState({ status: 'loading' });
    try {
      const excludedSymbols = new Set(indexConfig.excludedSymbols ?? []);
      const typedConstituents = indexConfig.constituents.filter(
        (constituent) => !excludedSymbols.has(constituent.symbol)
      );
      const symbols = typedConstituents.map((constituent) =>
        getQuoteSymbol(indexConfig, constituent)
      );
      const quotes = await fetchBatchQuotes(symbols);

      const quoteMap = new Map(quotes.map((q) => [q.symbol, q]));

      const stocks: StockData[] = typedConstituents
        .map((c) => {
          const quoteSymbol = getQuoteSymbol(indexConfig, c);
          const quote = quoteMap.get(quoteSymbol);
          const marketCap = quote?.marketCap && quote.marketCap > 0
            ? quote.marketCap
            : c.fallbackMarketCap ?? 0;
          if (marketCap <= 0) return null;

          return {
            symbol: c.symbol,
            name: c.name,
            sector: c.sector,
            subIndustry: c.subIndustry,
            exchange: c.exchange,
            price: quote?.price ?? 0,
            changesPercentage: quote?.changesPercentage ?? 0,
            marketCap,
          };
        })
        .filter((s): s is StockData => s !== null);

      if (requestId !== requestIdRef.current) return;
      setState({ status: 'success', data: stocks, timestamp: new Date() });
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setState({
        status: 'error',
        error: err instanceof Error ? err.message : 'Failed to fetch stock data',
      });
    }
  }, [indexConfig]);

  return { state, fetchData };
}
