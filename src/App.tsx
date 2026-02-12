import { useEffect, useState, useCallback } from 'react';
import { useStockData } from './hooks/useStockData';
import Header from './components/Header';
import Footer from './components/Footer';
import Heatmap from './components/Heatmap';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import { DEFAULT_INDEX_ID, getIndexById, MARKET_INDICES } from './data/indexConfigs';

const ACTIVE_INDEX_STORAGE_KEY = 'stock-heatmap-active-index';

function App() {
  const [activeIndexId, setActiveIndexId] = useState(() => {
    const savedIndexId = localStorage.getItem(ACTIVE_INDEX_STORAGE_KEY);
    if (!savedIndexId) return DEFAULT_INDEX_ID;
    return MARKET_INDICES.some((index) => index.id === savedIndexId)
      ? savedIndexId
      : DEFAULT_INDEX_ID;
  });
  const activeIndex = getIndexById(activeIndexId);
  const { state, fetchData } = useStockData(activeIndex);
  const [focusedSymbol, setFocusedSymbol] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStockSelect = (symbol: string) => {
    setFocusedSymbol(symbol);
  };

  const handleIndexChange = useCallback((indexId: string) => {
    setActiveIndexId(indexId);
    localStorage.setItem(ACTIVE_INDEX_STORAGE_KEY, indexId);
    setFocusedSymbol(null);
  }, []);

  const stocks = state.status === 'success' ? state.data : [];

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white">
      <Header 
        title="Stock market heatmap"
        onRefresh={fetchData} 
        isLoading={state.status === 'loading'} 
        stocks={stocks}
        onStockSelect={handleStockSelect}
        indexTabs={MARKET_INDICES.map((index) => ({
          id: index.id,
          label: index.label,
        }))}
        activeIndexId={activeIndexId}
        onIndexChange={handleIndexChange}
      />
      <main className="flex-1 min-h-0 p-2">
        {state.status === 'loading' && <LoadingState marketLabel={activeIndex.label} />}
        {state.status === 'error' && (
          <ErrorState message={state.error} onRetry={fetchData} />
        )}
        {state.status === 'success' && (
          <Heatmap 
            stocks={state.data} 
            rootName={activeIndex.label}
            focusedSymbol={focusedSymbol}
            onZoomReset={() => setFocusedSymbol(null)}
          />
        )}
      </main>
      <Footer
        timestamp={state.status === 'success' ? state.timestamp : null}
      />
    </div>
  );
}

export default App;
