import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import ChartWrapper from './ChartWrapper';
import { ChartDataPoint, ChartConfig } from './types';

interface WaterfallChartProps {
  data: ChartDataPoint[];
  config?: ChartConfig;
  className?: string;
}

const WaterfallChart: React.FC<WaterfallChartProps> = ({
  data,
  config = {},
  className,
}) => {
  const { title = 'Waterfall Chart', showGrid = true } = config;

  // Calculate cumulative values for waterfall
  let cumulative = 0;
  const waterfallData = data.map((item, index) => {
    const isStart = item.category === 'start' || index === 0;
    const isEnd = item.category === 'end' || index === data.length - 1;
    
    let start, end;
    
    if (isStart || isEnd) {
      start = 0;
      end = item.value;
      cumulative = item.value;
    } else {
      start = cumulative;
      end = cumulative + item.value;
      cumulative = end;
    }
    
    return {
      ...item,
      start: Math.min(start, end),
      end: Math.max(start, end),
      isPositive: item.value >= 0,
      isStart,
      isEnd,
    };
  });

  const getColor = (entry: any) => {
    if (entry.isStart || entry.isEnd) return '#6366f1';
    return entry.isPositive ? '#10b981' : '#ef4444';
  };

  return (
    <ChartWrapper title={title} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={waterfallData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            formatter={(value, name, props) => {
              const entry = props.payload;
              return [entry.value, 'Value'];
            }}
          />
          <ReferenceLine y={0} stroke="hsl(var(--border))" />
          {/* Invisible bar for spacing */}
          <Bar dataKey="start" stackId="stack" fill="transparent" />
          {/* Visible bar */}
          <Bar dataKey="end" stackId="stack" radius={[4, 4, 0, 0]}>
            {waterfallData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default WaterfallChart;
