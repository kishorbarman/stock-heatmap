export interface IndexConstituent {
  symbol: string;
  quoteSymbol?: string;
  name: string;
  sector: string;
  subIndustry: string;
  exchange: string;
  fallbackMarketCap?: number;
}

export interface MarketIndexConfig {
  id: string;
  label: string;
  heatmapTitle: string;
  constituents: IndexConstituent[];
  excludedSymbols?: string[];
  quoteSymbolTransformer?: (symbol: string) => string;
}

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  changesPercentage: number;
  change: number;
  marketCap: number;
  volume: number;
  exchange: string;
  timestamp: number;
}

export interface StockData {
  symbol: string;
  name: string;
  sector: string;
  subIndustry: string;
  exchange: string;
  price: number;
  changesPercentage: number;
  marketCap: number;
}

export interface TreemapNode {
  name: string;
  children?: TreemapNode[];
  // Leaf node fields
  fullName?: string;
  value?: number;
  changesPercentage?: number;
  marketCap?: number;
  sector?: string;
  subIndustry?: string;
  exchange?: string;
}

export interface TooltipData {
  x: number;
  y: number;
  stock: StockData;
  visible: boolean;
}

export type DataState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: StockData[]; timestamp: Date }
  | { status: 'error'; error: string };
