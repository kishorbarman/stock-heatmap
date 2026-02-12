import sp500Constituents from './sp500-constituents.json';
import nifty100Constituents from './nifty100-constituents.json';
import type { MarketIndexConfig, IndexConstituent } from '../types';

function withSuffix(suffix: string): (symbol: string) => string {
  return (symbol: string) => `${symbol}${suffix}`;
}

export const MARKET_INDICES: MarketIndexConfig[] = [
  {
    id: 'sp500',
    label: 'S&P 500',
    heatmapTitle: 'S&P 500 Heatmap',
    constituents: sp500Constituents as IndexConstituent[],
    excludedSymbols: ['GOOGL', 'FOXA', 'NWSA'],
  },
  {
    id: 'nifty100',
    label: 'Nifty 100',
    heatmapTitle: 'Nifty 100 Heatmap',
    constituents: nifty100Constituents as IndexConstituent[],
    quoteSymbolTransformer: withSuffix('.NS'),
  },
];

export const DEFAULT_INDEX_ID = MARKET_INDICES[0]?.id ?? 'sp500';

export function getIndexById(indexId: string): MarketIndexConfig {
  const firstIndex = MARKET_INDICES[0];
  if (!firstIndex) {
    throw new Error('No market indices configured');
  }

  return MARKET_INDICES.find((index) => index.id === indexId) ?? firstIndex;
}

export function getQuoteSymbol(index: MarketIndexConfig, constituent: IndexConstituent): string {
  const baseSymbol = constituent.quoteSymbol ?? constituent.symbol;
  return index.quoteSymbolTransformer
    ? index.quoteSymbolTransformer(baseSymbol)
    : baseSymbol;
}
