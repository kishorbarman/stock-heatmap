import { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import * as d3 from 'd3';
import type { StockData, TooltipData } from '../types';
import { buildHierarchy, computeTreemapLayout } from '../utils/treemapLayout';
import { useResizeObserver } from '../hooks/useResizeObserver';
import StockTile from './StockTile';
import Tooltip from './Tooltip';

interface HeatmapProps {
  stocks: StockData[];
}

export default function Heatmap({ stocks }: HeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const { width, height } = useResizeObserver(containerRef);
  const [scale, setScale] = useState(1);
  const [tooltip, setTooltip] = useState<TooltipData>({
    x: 0,
    y: 0,
    stock: {} as StockData,
    visible: false,
  });

  const root = useMemo(() => {
    if (!width || !height) return null;
    const hierarchy = buildHierarchy(stocks);
    return computeTreemapLayout(hierarchy, width, height);
  }, [stocks, width, height]);

  // Set up d3-zoom
  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;

    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 20])
      .on('zoom', (event) => {
        g.attr('transform', event.transform.toString());
        setScale(event.transform.k);
        // Hide tooltip during zoom/pan
        setTooltip((prev) => ({ ...prev, visible: false }));
      });

    svg.call(zoom);

    // Double-click to reset zoom
    svg.on('dblclick.zoom', () => {
      svg.transition().duration(300).call(zoom.transform, d3.zoomIdentity);
    });

    return () => {
      svg.on('.zoom', null);
    };
  }, [width, height]);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent, stock: StockData) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setTooltip({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        stock,
        visible: true,
      });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleClick = useCallback((stock: StockData) => {
    const url = `https://www.google.com/finance/quote/${stock.symbol}:${stock.exchange}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const leaves = useMemo(() => {
    if (!root) return [];
    return root.leaves();
  }, [root]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {root && (
        <svg ref={svgRef} width={width} height={height} style={{ cursor: 'grab' }}>
          <g ref={gRef}>
            {leaves.map((leaf) => (
              <StockTile
                key={leaf.data.name}
                node={leaf}
                scale={scale}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
              />
            ))}
          </g>
        </svg>
      )}
      <Tooltip data={tooltip} />
    </div>
  );
}
