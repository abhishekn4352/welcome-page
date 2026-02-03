import React from 'react';
import ChartWrapper from './ChartWrapper';
import { ChartConfig, CHART_COLORS_HEX } from './types';
import { cn } from '@/lib/utils';

interface HeatmapDataPoint {
  x: string;
  y: string;
  value: number;
}

interface HeatmapChartProps {
  data: HeatmapDataPoint[];
  config?: ChartConfig;
  className?: string;
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({
  data,
  config = {},
  className,
}) => {
  const { title = 'Heatmap Chart' } = config;

  // Get unique x and y values
  const xLabels = [...new Set(data.map(d => d.x))];
  const yLabels = [...new Set(data.map(d => d.y))];
  
  // Calculate min/max for color scale
  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const getColor = (value: number) => {
    const normalized = (value - minValue) / (maxValue - minValue);
    // Color scale from light to primary
    const hue = 220; // Blue hue
    const saturation = 70 + normalized * 20;
    const lightness = 90 - normalized * 50;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const getValue = (x: string, y: string) => {
    const point = data.find(d => d.x === x && d.y === y);
    return point?.value ?? 0;
  };

  return (
    <ChartWrapper title={title} className={className}>
      <div className="h-full overflow-auto">
        <div className="min-w-max">
          {/* Header row */}
          <div className="flex">
            <div className="w-12 h-6 shrink-0" /> {/* Corner */}
            {xLabels.slice(0, 12).map((x, i) => (
              <div 
                key={x} 
                className="w-8 h-6 text-[10px] text-muted-foreground text-center flex items-center justify-center"
              >
                {i % 3 === 0 ? x : ''}
              </div>
            ))}
          </div>
          
          {/* Data rows */}
          {yLabels.map(y => (
            <div key={y} className="flex">
              <div className="w-12 h-6 text-[10px] text-muted-foreground flex items-center pr-2 justify-end shrink-0">
                {y}
              </div>
              {xLabels.slice(0, 12).map(x => {
                const value = getValue(x, y);
                return (
                  <div
                    key={`${x}-${y}`}
                    className="w-8 h-6 rounded-sm m-0.5 flex items-center justify-center text-[9px] font-medium cursor-pointer transition-transform hover:scale-110 hover:z-10"
                    style={{ backgroundColor: getColor(value) }}
                    title={`${y}, ${x}: ${value}`}
                  >
                    {value > (maxValue * 0.7) && (
                      <span className="text-white">{value}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          
          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 ml-12">
            <span className="text-xs text-muted-foreground">Low</span>
            <div className="flex h-3 rounded overflow-hidden">
              {[0, 0.25, 0.5, 0.75, 1].map(n => (
                <div 
                  key={n}
                  className="w-6 h-full"
                  style={{ backgroundColor: getColor(minValue + n * (maxValue - minValue)) }}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">High</span>
          </div>
        </div>
      </div>
    </ChartWrapper>
  );
};

export default HeatmapChart;
