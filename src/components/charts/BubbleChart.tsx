import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ZAxis,
} from 'recharts';
import ChartWrapper from './ChartWrapper';
import { ChartDataPoint, ChartConfig, CHART_COLORS_HEX } from './types';

interface BubbleChartProps {
  data: ChartDataPoint[];
  config?: ChartConfig;
  className?: string;
}

const BubbleChart: React.FC<BubbleChartProps> = ({
  data,
  config = {},
  className,
}) => {
  const { title = 'Bubble Chart', showLegend = true, showGrid = true, colors = CHART_COLORS_HEX } = config;

  return (
    <ChartWrapper title={title} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
          <XAxis 
            type="number" 
            dataKey="value" 
            name="X"
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
          />
          <YAxis 
            type="number" 
            dataKey="value2" 
            name="Y"
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
          />
          <ZAxis 
            type="number" 
            dataKey="value3" 
            name="Size"
            range={[50, 400]}
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          {showLegend && <Legend />}
          <Scatter 
            name="Bubbles" 
            data={data} 
            fill={colors[0]}
            fillOpacity={0.6}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default BubbleChart;
