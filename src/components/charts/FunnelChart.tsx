import React from 'react';
import ChartWrapper from './ChartWrapper';
import { ChartDataPoint, ChartConfig, CHART_COLORS_HEX } from './types';

interface FunnelChartProps {
  data: ChartDataPoint[];
  config?: ChartConfig;
  className?: string;
}

const FunnelChart: React.FC<FunnelChartProps> = ({
  data,
  config = {},
  className,
}) => {
  const { title = 'Funnel Chart', colors = CHART_COLORS_HEX } = config;
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <ChartWrapper title={title} className={className}>
      <div className="h-full flex flex-col justify-center gap-2 px-4">
        {data.map((item, index) => {
          const widthPercent = (item.value / maxValue) * 100;
          const conversionRate = index > 0 
            ? ((item.value / data[index - 1].value) * 100).toFixed(1) 
            : '100';
          
          return (
            <div key={item.name} className="flex items-center gap-3">
              <div className="w-24 text-right">
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>
              <div className="flex-1 relative">
                <div
                  className="h-8 rounded-md flex items-center justify-center transition-all duration-300"
                  style={{
                    width: `${widthPercent}%`,
                    backgroundColor: colors[index % colors.length],
                    marginLeft: `${(100 - widthPercent) / 2}%`,
                  }}
                >
                  <span className="text-xs font-medium text-white">
                    {item.value.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="w-16">
                <span className="text-xs text-muted-foreground">
                  {index > 0 ? `${conversionRate}%` : ''}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </ChartWrapper>
  );
};

export default FunnelChart;
