import React from 'react';
import type { HierarchyRectangularNode } from 'd3';
import type { TreemapNode, StockData } from '../types';
import { getColor } from '../utils/colorScale';
import { formatPercent, formatMarketCap } from '../utils/formatters';

interface StockTileProps {
  node: HierarchyRectangularNode<TreemapNode>;
  scale: number;
  onMouseEnter: (e: React.MouseEvent, stock: StockData) => void;
  onMouseLeave: () => void;
  onClick: (stock: StockData) => void;
}

function StockTile({ node, scale, onMouseEnter, onMouseLeave, onClick }: StockTileProps) {
  const d = node.data;
  const x = node.x0;
  const y = node.y0;
  const w = node.x1 - node.x0;
  const h = node.y1 - node.y0;

  if (w < 1 || h < 1) return null;

  const change = d.changesPercentage ?? 0;
  const color = getColor(change);

  // Effective dimensions account for zoom level
  const ew = w * scale;
  const eh = h * scale;

  const showTicker = ew > 30 && eh > 18;
  const showPercent = ew > 45 && eh > 32;
  const showDetails = ew > 100 && eh > 60;

  // Font size in SVG units (will be scaled by the zoom transform)
  const baseFontSize = Math.min(Math.max(Math.min(w, h) * 0.18, 8 / scale), 14 / scale);

  const stock: StockData = {
    symbol: d.name,
    name: d.fullName ?? d.name,
    sector: d.sector ?? '',
    subIndustry: d.subIndustry ?? '',
    exchange: d.exchange ?? '',
    price: 0,
    changesPercentage: change,
    marketCap: d.marketCap ?? 0,
  };

  return (
    <g
      style={{ cursor: 'pointer' }}
      onMouseEnter={(e) => onMouseEnter(e, stock)}
      onMouseLeave={onMouseLeave}
      onClick={() => onClick(stock)}
    >
      <rect x={x} y={y} width={w} height={h} fill={color} rx={1 / scale} />
      {showTicker && (
        <text
          x={x + w / 2}
          y={y + h / 2 - (showPercent ? baseFontSize * 0.5 : 0) - (showDetails ? baseFontSize * 0.5 : 0)}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={baseFontSize}
          fontWeight={700}
          fill="white"
          style={{ pointerEvents: 'none' }}
        >
          {d.name}
        </text>
      )}
      {showPercent && (
        <text
          x={x + w / 2}
          y={y + h / 2 + baseFontSize * (showDetails ? 0.2 : 0.6)}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={baseFontSize * 0.85}
          fill="rgba(255,255,255,0.85)"
          style={{ pointerEvents: 'none' }}
        >
          {formatPercent(change)}
        </text>
      )}
      {showDetails && (
        <>
          <text
            x={x + w / 2}
            y={y + h / 2 + baseFontSize * 1.4}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={baseFontSize * 0.65}
            fill="rgba(255,255,255,0.55)"
            style={{ pointerEvents: 'none' }}
          >
            {d.fullName && d.fullName.length > w / (baseFontSize * 0.4)
              ? d.fullName.slice(0, Math.floor(w / (baseFontSize * 0.4))) + '…'
              : d.fullName}
          </text>
          <text
            x={x + w / 2}
            y={y + h / 2 + baseFontSize * 2.3}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={baseFontSize * 0.55}
            fill="rgba(255,255,255,0.4)"
            style={{ pointerEvents: 'none' }}
          >
            {formatMarketCap(d.marketCap ?? 0)}
          </text>
        </>
      )}
    </g>
  );
}

export default React.memo(StockTile);
