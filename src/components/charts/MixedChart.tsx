import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import ChartWrapper from './ChartWrapper';
import { ChartDataPoint, ChartConfig, CHART_COLORS_HEX } from './types';

interface MixedChartProps {
  data: ChartDataPoint[];
  config?: ChartConfig;
  className?: string;
}

const MixedChart: React.FC<MixedChartProps> = ({
  data,
  config = {},
  className,
}) => {
  const { title = 'Mixed Chart', showLegend = true, showGrid = true, colors = CHART_COLORS_HEX } = config;

  return (
    <ChartWrapper title={title} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
          />
          {showLegend && <Legend />}
          <Area 
            type="monotone" 
            dataKey="value3" 
            fill={colors[2]}
            fillOpacity={0.3}
            stroke={colors[2]}
            name="Area"
          />
          <Bar 
            dataKey="value2" 
            fill={colors[1]}
            radius={[4, 4, 0, 0]}
            name="Bar"
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={colors[0]}
            strokeWidth={2}
            dot={{ r: 4 }}
            name="Line"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default MixedChart;
