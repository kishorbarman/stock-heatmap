import type { TooltipData } from '../types';
import { formatMarketCap, formatPercent } from '../utils/formatters';

interface TooltipProps {
  data: TooltipData;
}

export default function Tooltip({ data }: TooltipProps) {
  if (!data.visible) return null;

  const { stock } = data;
  const isPositive = stock.changesPercentage >= 0;

  return (
    <div
      className="absolute z-50 bg-gray-900 border border-gray-600 rounded-lg shadow-xl px-3 py-2 text-sm text-white pointer-events-none"
      style={{
        left: data.x + 12,
        top: data.y + 12,
      }}
    >
      <div className="font-bold">
        {stock.name} ({stock.symbol})
      </div>
      <div className={isPositive ? 'text-green-400' : 'text-red-400'}>
        {formatPercent(stock.changesPercentage)}
      </div>
      <div className="text-gray-300">
        Market Cap: {formatMarketCap(stock.marketCap)}
      </div>
      <div className="text-gray-400 text-xs">{stock.sector}</div>
      <div className="text-gray-400 text-xs">{stock.subIndustry}</div>
    </div>
  );
}
