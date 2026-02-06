interface HeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export default function Header({ onRefresh, isLoading }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
      <h1 className="text-lg font-bold text-white">S&P 500 Heatmap</h1>
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
