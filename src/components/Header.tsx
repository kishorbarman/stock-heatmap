import type { StockData } from '../types';
import SearchBox from './SearchBox';

interface HeaderProps {
  title: string;
  onRefresh: () => void;
  isLoading: boolean;
  stocks: StockData[];
  onStockSelect: (symbol: string) => void;
  indexTabs: Array<{ id: string; label: string }>;
  activeIndexId: string;
  onIndexChange: (indexId: string) => void;
}

export default function Header({
  title,
  onRefresh,
  isLoading,
  stocks,
  onStockSelect,
  indexTabs,
  activeIndexId,
  onIndexChange,
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 px-4 py-3 bg-gray-900 border-b border-gray-800">
      <div className="flex items-center gap-4 min-w-0">
        <h1 className="text-lg font-bold text-white whitespace-nowrap">{title}</h1>
        <div className="flex items-center gap-1 bg-gray-950 border border-gray-800 rounded-md p-1">
          {indexTabs.map((tab) => {
            const isActive = tab.id === activeIndexId;
            return (
              <button
                key={tab.id}
                onClick={() => onIndexChange(tab.id)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <SearchBox stocks={stocks} onSelect={onStockSelect} />
      </div>
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-200 rounded-md border border-gray-700 transition-colors"
      >
        {isLoading ? 'Loading...' : 'Refresh'}
      </button>
    </header>
  );
}
