import { useEffect } from 'react';
import { useStockData } from './hooks/useStockData';
import Header from './components/Header';
import Footer from './components/Footer';
import Heatmap from './components/Heatmap';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';

function App() {
  const { state, fetchData } = useStockData();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white">
      <Header onRefresh={fetchData} isLoading={state.status === 'loading'} />
      <main className="flex-1 min-h-0 p-2">
        {state.status === 'loading' && <LoadingState />}
        {state.status === 'error' && (
          <ErrorState message={state.error} onRetry={fetchData} />
        )}
        {state.status === 'success' && <Heatmap stocks={state.data} />}
      </main>
      <Footer
        timestamp={state.status === 'success' ? state.timestamp : null}
      />
    </div>
  );
}

export default App;
