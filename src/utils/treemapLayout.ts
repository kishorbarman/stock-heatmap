import * as d3 from 'd3';
import type { StockData, TreemapNode } from '../types';

export function buildHierarchy(stocks: StockData[]): TreemapNode {
  return {
    name: 'S&P 500',
    children: stocks.map((s) => ({
      name: s.symbol,
      fullName: s.name,
      value: s.marketCap,
      changesPercentage: s.changesPercentage,
      marketCap: s.marketCap,
      sector: s.sector,
      subIndustry: s.subIndustry,
      exchange: s.exchange,
    })),
  };
}

export function computeTreemapLayout(
  hierarchy: TreemapNode,
  width: number,
  height: number
) {
  const root = d3
    .hierarchy(hierarchy)
    .sum((d) => d.value ?? 0)
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

  const treemap = d3
    .treemap<TreemapNode>()
    .size([width, height])
    .padding(1)
    .tile(d3.treemapSquarify.ratio(1.618));

  treemap(root);
  return root;
}
