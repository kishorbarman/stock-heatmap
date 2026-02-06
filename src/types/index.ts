export interface SP500Constituent {
  symbol: string;
  name: string;
  sector: string;
  subIndustry: string;
  exchange: 'NYSE' | 'NASDAQ';
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
  exchange: 'NYSE' | 'NASDAQ';
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
  exchange?: 'NYSE' | 'NASDAQ';
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
