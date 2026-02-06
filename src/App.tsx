import { useEffect, useState } from 'react';
import { useStockData } from './hooks/useStockData';
import Header from './components/Header';
import Footer from './components/Footer';
import Heatmap from './components/Heatmap';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';

function App() {
  const { state, fetchData } = useStockData();
  const [focusedSymbol, setFocusedSymbol] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStockSelect = (symbol: string) => {
    setFocusedSymbol(symbol);
  };

  const stocks = state.status === 'success' ? state.data : [];

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white">
      <Header 
        onRefresh={fetchData} 
        isLoading={state.status === 'loading'} 
        stocks={stocks}
        onStockSelect={handleStockSelect}
      />
      <main className="flex-1 min-h-0 p-2">
        {state.status === 'loading' && <LoadingState />}
        {state.status === 'error' && (
          <ErrorState message={state.error} onRetry={fetchData} />
        )}
        {state.status === 'success' && (
          <Heatmap 
            stocks={state.data} 
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
