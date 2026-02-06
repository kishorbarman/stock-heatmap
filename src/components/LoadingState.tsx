export default function LoadingState() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin mb-3" />
        <p className="text-gray-400 text-sm">Loading S&P 500 data...</p>
      </div>
    </div>
  );
}
