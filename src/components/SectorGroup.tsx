import type { HierarchyRectangularNode } from 'd3';
import type { TreemapNode } from '../types';
import { getSectorChange } from '../utils/treemapLayout';
import { formatPercent } from '../utils/formatters';

interface SectorGroupProps {
  node: HierarchyRectangularNode<TreemapNode>;
  children: React.ReactNode;
}

export default function SectorGroup({ node, children }: SectorGroupProps) {
  const x = node.x0;
  const y = node.y0;
  const w = node.x1 - node.x0;
  const h = node.y1 - node.y0;

  if (w < 2 || h < 2) return null;

  const showLabel = w > 60;
  const sectorChange = getSectorChange(node);
  const label = `${node.data.name} ${formatPercent(sectorChange)}`;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="none"
        stroke="#555"
        strokeWidth={1}
      />
      {showLabel && (
        <text
          x={x + 4}
          y={y + 16}
          fontSize={11}
          fontWeight={600}
          fill="#ccc"
          style={{ pointerEvents: 'none' }}
        >
          <tspan>{node.data.name}</tspan>
          <tspan
            dx={4}
            fill={sectorChange >= 0 ? '#66bb6a' : '#ef5350'}
          >
            {formatPercent(sectorChange)}
          </tspan>
        </text>
      )}
      {children}
    </g>
  );
}
