interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="text-red-400 text-4xl mb-3">!</div>
        <p className="text-red-300 text-sm mb-4">{message}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-md border border-gray-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
