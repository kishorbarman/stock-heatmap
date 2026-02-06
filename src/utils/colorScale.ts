import { scaleLinear } from 'd3-scale';
import { interpolateRgb } from 'd3-interpolate';

const colorScale = scaleLinear<string>()
  .domain([-3, 0, 3])
  .range(['#e53935', '#4a4a4a', '#43a047'])
  .interpolate(interpolateRgb)
  .clamp(true);

export function getColor(changesPercentage: number): string {
  return colorScale(changesPercentage);
}

export { colorScale };
