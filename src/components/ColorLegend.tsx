export default function ColorLegend() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400">-3%</span>
      <div
        className="h-3 w-40 rounded"
        style={{
          background: 'linear-gradient(to right, #e53935, #4a4a4a, #43a047)',
        }}
      />
      <span className="text-xs text-gray-400">+3%</span>
    </div>
  );
}
