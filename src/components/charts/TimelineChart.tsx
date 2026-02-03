import React from 'react';
import ChartWrapper from './ChartWrapper';
import { ChartConfig, CHART_COLORS_HEX } from './types';
import { Circle, CheckCircle2, Clock, Star } from 'lucide-react';

interface TimelineEvent {
  date: string;
  event: string;
  type?: 'milestone' | 'release' | 'update' | 'default';
  description?: string;
}

interface TimelineChartProps {
  data: TimelineEvent[];
  config?: ChartConfig;
  className?: string;
}

const TimelineChart: React.FC<TimelineChartProps> = ({
  data,
  config = {},
  className,
}) => {
  const { title = 'Timeline Chart', colors = CHART_COLORS_HEX } = config;

  const getIcon = (type?: string) => {
    switch (type) {
      case 'milestone':
        return <Star className="w-4 h-4" />;
      case 'release':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'update':
        return <Clock className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  const getColor = (type?: string, index?: number) => {
    switch (type) {
      case 'milestone':
        return colors[0];
      case 'release':
        return colors[1];
      case 'update':
        return colors[2];
      default:
        return colors[(index || 0) % colors.length];
    }
  };

  return (
    <ChartWrapper title={title} className={className}>
      <div className="h-full overflow-auto py-2">
        <div className="relative pl-6">
          {/* Vertical line */}
          <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-border" />
          
          {data.map((item, index) => (
            <div key={index} className="relative flex gap-4 pb-6 last:pb-0">
              {/* Icon */}
              <div
                className="absolute left-0 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center bg-background border-2"
                style={{ 
                  borderColor: getColor(item.type, index),
                  color: getColor(item.type, index)
                }}
              >
                {getIcon(item.type)}
              </div>
              
              {/* Content */}
              <div className="ml-4 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  {item.type && (
                    <span 
                      className="text-xs px-1.5 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: getColor(item.type, index) }}
                    >
                      {item.type}
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-medium text-foreground">{item.event}</h4>
                {item.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ChartWrapper>
  );
};

export default TimelineChart;
