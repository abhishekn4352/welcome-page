import React from 'react';
import ChartWrapper from './ChartWrapper';
import { ChartConfig } from './types';
import { MapPin } from 'lucide-react';

interface MapDataPoint {
  name: string;
  lat: number;
  lng: number;
  value: number;
}

interface MapChartProps {
  data?: MapDataPoint[];
  config?: ChartConfig;
  className?: string;
}

// Simple placeholder map visualization
const MapChart: React.FC<MapChartProps> = ({
  data = [
    { name: 'New York', lat: 40.7, lng: -74, value: 850 },
    { name: 'Los Angeles', lat: 34, lng: -118.2, value: 720 },
    { name: 'Chicago', lat: 41.9, lng: -87.6, value: 550 },
    { name: 'Houston', lat: 29.8, lng: -95.4, value: 480 },
    { name: 'Phoenix', lat: 33.4, lng: -112.1, value: 320 },
  ],
  config = {},
  className,
}) => {
  const { title = 'Map Chart' } = config;
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <ChartWrapper title={title} className={className}>
      <div className="h-full flex flex-col">
        {/* Simple map placeholder */}
        <div className="flex-1 relative bg-muted/30 rounded-lg overflow-hidden">
          {/* Grid overlay */}
          <div className="absolute inset-0 grid grid-cols-8 grid-rows-6">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="border-r border-b border-border/30" />
            ))}
          </div>
          
          {/* Data points */}
          {data.map((point, index) => {
            // Simple positioning (normalized to container)
            const x = ((point.lng + 130) / 70) * 100; // US approximate range
            const y = ((50 - point.lat) / 25) * 100;
            const size = (point.value / maxValue) * 40 + 20;
            
            return (
              <div
                key={point.name}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div
                  className="rounded-full bg-primary/20 flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ width: size, height: size }}
                >
                  <div 
                    className="rounded-full bg-primary flex items-center justify-center"
                    style={{ width: size * 0.5, height: size * 0.5 }}
                  >
                    <MapPin className="w-3 h-3 text-primary-foreground" />
                  </div>
                </div>
                {/* Tooltip on hover */}
                <div className="absolute top-full mt-1 bg-popover border border-border rounded px-2 py-1 text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  <span className="font-medium">{point.name}</span>
                  <span className="text-muted-foreground ml-1">{point.value}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-3 justify-center">
          {data.map((point, index) => (
            <div key={point.name} className="flex items-center gap-1.5 text-xs">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">{point.name}</span>
              <span className="font-medium">{point.value}</span>
            </div>
          ))}
        </div>
      </div>
    </ChartWrapper>
  );
};

export default MapChart;
