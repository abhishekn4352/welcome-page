import React from 'react';
import ChartWrapper from './ChartWrapper';
import { ChartConfig, CHART_COLORS_HEX } from './types';

interface GaugeChartProps {
  value: number;
  min?: number;
  max?: number;
  segments?: { start: number; end: number; color: string }[];
  config?: ChartConfig;
  className?: string;
  label?: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  min = 0,
  max = 100,
  segments = [
    { start: 0, end: 30, color: '#ef4444' },
    { start: 30, end: 70, color: '#f59e0b' },
    { start: 70, end: 100, color: '#10b981' },
  ],
  config = {},
  className,
  label,
}) => {
  const { title = 'Gauge Chart' } = config;
  
  // Calculate angle (180 degree arc)
  const normalizedValue = Math.min(Math.max(value, min), max);
  const percentage = ((normalizedValue - min) / (max - min)) * 100;
  const angle = (percentage / 100) * 180 - 90; // -90 to 90 degrees

  const getColorForValue = () => {
    for (const segment of segments) {
      if (percentage >= segment.start && percentage <= segment.end) {
        return segment.color;
      }
    }
    return CHART_COLORS_HEX[0];
  };

  return (
    <ChartWrapper title={title} className={className}>
      <div className="h-full flex flex-col items-center justify-center">
        <div className="relative w-48 h-24 overflow-hidden">
          {/* Background arc */}
          <svg viewBox="0 0 200 100" className="w-full h-full">
            {/* Background segments */}
            {segments.map((segment, index) => {
              const startAngle = ((segment.start / 100) * 180 - 90) * (Math.PI / 180);
              const endAngle = ((segment.end / 100) * 180 - 90) * (Math.PI / 180);
              const radius = 80;
              const cx = 100;
              const cy = 90;
              
              const x1 = cx + radius * Math.cos(startAngle);
              const y1 = cy + radius * Math.sin(startAngle);
              const x2 = cx + radius * Math.cos(endAngle);
              const y2 = cy + radius * Math.sin(endAngle);
              
              const largeArcFlag = (segment.end - segment.start) > 50 ? 1 : 0;
              
              return (
                <path
                  key={index}
                  d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="16"
                  strokeOpacity="0.2"
                  strokeLinecap="round"
                />
              );
            })}
            
            {/* Active arc */}
            <path
              d={`M ${100 + 80 * Math.cos(-90 * Math.PI / 180)} ${90 + 80 * Math.sin(-90 * Math.PI / 180)} 
                  A 80 80 0 ${percentage > 50 ? 1 : 0} 1 
                  ${100 + 80 * Math.cos(angle * Math.PI / 180)} ${90 + 80 * Math.sin(angle * Math.PI / 180)}`}
              fill="none"
              stroke={getColorForValue()}
              strokeWidth="16"
              strokeLinecap="round"
            />
            
            {/* Needle */}
            <line
              x1="100"
              y1="90"
              x2={100 + 60 * Math.cos(angle * Math.PI / 180)}
              y2={90 + 60 * Math.sin(angle * Math.PI / 180)}
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="100" cy="90" r="6" fill="currentColor" />
          </svg>
        </div>
        
        {/* Value display */}
        <div className="text-center mt-2">
          <span className="text-3xl font-bold" style={{ color: getColorForValue() }}>
            {normalizedValue}
          </span>
          <span className="text-sm text-muted-foreground ml-1">/ {max}</span>
        </div>
        {label && (
          <span className="text-xs text-muted-foreground mt-1">{label}</span>
        )}
      </div>
    </ChartWrapper>
  );
};

export default GaugeChart;
