import { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import * as d3 from 'd3';
import type { StockData, TooltipData } from '../types';
import { buildHierarchy, computeTreemapLayout } from '../utils/treemapLayout';
import { useResizeObserver } from '../hooks/useResizeObserver';
import StockTile from './StockTile';
import Tooltip from './Tooltip';

interface HeatmapProps {
  stocks: StockData[];
  rootName?: string;
  focusedSymbol?: string | null;
  onZoomReset?: () => void;
}

export default function Heatmap({ stocks, rootName, focusedSymbol, onZoomReset }: HeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  
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
    const hierarchy = buildHierarchy(stocks, rootName);
    return computeTreemapLayout(hierarchy, width, height);
  }, [stocks, rootName, width, height]);

  const leaves = useMemo(() => {
    if (!root) return [];
    return root.leaves();
  }, [root]);

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
        setTooltip((prev) => ({ ...prev, visible: false }));
      });
    
    zoomBehaviorRef.current = zoom;

    svg.call(zoom);

    svg.on('dblclick.zoom', () => {
      svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
      if (onZoomReset) onZoomReset();
    });

    return () => {
      svg.on('.zoom', null);
    };
  }, [width, height, onZoomReset]);

  // Handle focusedSymbol changes
  useEffect(() => {
    if (!focusedSymbol || !root || !width || !height || !svgRef.current || !zoomBehaviorRef.current) {
        if (!focusedSymbol && svgRef.current && zoomBehaviorRef.current) {
            // Reset zoom if symbol is cleared
            d3.select(svgRef.current)
                .transition()
                .duration(750)
                .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
        }
        return;
    }

    const targetNode = leaves.find(leaf => leaf.data.name === focusedSymbol);
    if (!targetNode) return;

    const x0 = targetNode.x0;
    const x1 = targetNode.x1;
    const y0 = targetNode.y0;
    const y1 = targetNode.y1;

    // Calculate scale to make the node occupy roughly 1/4 of the screen (min dimension)
    // or at least be clearly visible.
    const nodeWidth = x1 - x0;
    const nodeHeight = y1 - y0;
    
    // Target scale: we want the node to be large. 
    // Let's aim for the node to cover ~40% of the viewport width or height.
    const scaleX = (width * 0.4) / nodeWidth;
    const scaleY = (height * 0.4) / nodeHeight;
    const k = Math.min(20, Math.max(1, Math.min(scaleX, scaleY)));

    const tx = width / 2 - ((x0 + x1) / 2) * k;
    const ty = height / 2 - ((y0 + y1) / 2) * k;

    const transform = d3.zoomIdentity.translate(tx, ty).scale(k);

    d3.select(svgRef.current)
        .transition()
        .duration(1000)
        .call(zoomBehaviorRef.current.transform, transform);

  }, [focusedSymbol, root, leaves, width, height]);

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
    const exchange = stock.exchange ? `:${stock.exchange}` : '';
    const url = `https://www.google.com/finance/quote/${encodeURIComponent(stock.symbol)}${exchange}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

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
