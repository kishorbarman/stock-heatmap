import { useState, useMemo, useEffect, useRef } from 'react';
import type { StockData } from '../types';

interface SearchBoxProps {
  stocks: StockData[];
  onSelect: (symbol: string) => void;
}

export default function SearchBox({ stocks, onSelect }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredStocks = useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return stocks
      .filter(
        (s) =>
          s.symbol.toLowerCase().includes(lowerQuery) ||
          s.name.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 10); // Limit to 10 results
  }, [stocks, query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (symbol: string) => {
    onSelect(symbol);
    setQuery(symbol);
    setIsOpen(false);
  };

  return (
    <div className="relative w-64" ref={containerRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search ticker or company..."
          className="w-full bg-gray-800 text-white text-sm rounded-md border border-gray-700 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
        />
        {query && (
          <button
            onClick={() => {
                setQuery('');
                setIsOpen(false);
                // Optional: Trigger a clear action if needed
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && filteredStocks.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredStocks.map((stock) => (
            <li
              key={stock.symbol}
              onClick={() => handleSelect(stock.symbol)}
              className="px-3 py-2 text-sm text-gray-200 hover:bg-gray-700 cursor-pointer flex justify-between items-center"
            >
              <span className="font-bold">{stock.symbol}</span>
              <span className="truncate ml-2 text-gray-400 text-xs">{stock.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
