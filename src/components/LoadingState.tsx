interface LoadingStateProps {
  marketLabel?: string;
}

export default function LoadingState({ marketLabel = 'market' }: LoadingStateProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin mb-3" />
        <p className="text-gray-400 text-sm">Loading {marketLabel} data...</p>
      </div>
    </div>
  );
}
