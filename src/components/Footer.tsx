import ColorLegend from './ColorLegend';
import { formatTimestamp } from '../utils/formatters';

interface FooterProps {
  timestamp: Date | null;
}

export default function Footer({ timestamp }: FooterProps) {
  return (
    <footer className="flex items-center justify-between px-4 py-2 bg-gray-900 border-t border-gray-800">
      <ColorLegend />
      {timestamp && (
        <span className="text-xs text-gray-500">
          {formatTimestamp(timestamp)}
        </span>
      )}
    </footer>
  );
}
