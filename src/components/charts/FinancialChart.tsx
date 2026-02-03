import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import ChartWrapper from './ChartWrapper';
import { ChartConfig, CHART_COLORS_HEX } from './types';

interface FinancialDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

interface FinancialChartProps {
  data: FinancialDataPoint[];
  config?: ChartConfig;
  className?: string;
  showVolume?: boolean;
}

const FinancialChart: React.FC<FinancialChartProps> = ({
  data,
  config = {},
  className,
  showVolume = true,
}) => {
  const { title = 'Financial Chart', showGrid = true, colors = CHART_COLORS_HEX } = config;

  // Transform data for display
  const chartData = data.map(item => ({
    ...item,
    change: item.close - item.open,
    isPositive: item.close >= item.open,
  }));

  return (
    <ChartWrapper title={title} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 10 }}
            className="text-muted-foreground"
            interval="preserveStartEnd"
          />
          <YAxis 
            yAxisId="price"
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
            domain={['dataMin - 5', 'dataMax + 5']}
          />
          {showVolume && (
            <YAxis 
              yAxisId="volume"
              orientation="right"
              tick={{ fontSize: 10 }}
              className="text-muted-foreground"
            />
          )}
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            formatter={(value: number, name: string) => [
              typeof value === 'number' ? value.toFixed(2) : value,
              name.charAt(0).toUpperCase() + name.slice(1)
            ]}
          />
          <Legend />
          
          {/* Volume bars */}
          {showVolume && (
            <Bar
              yAxisId="volume"
              dataKey="volume"
              fill={colors[2]}
              fillOpacity={0.3}
              name="Volume"
            />
          )}
          
          {/* Price lines */}
          <Line
            yAxisId="price"
            type="monotone"
            dataKey="high"
            stroke={colors[1]}
            strokeWidth={1}
            dot={false}
            name="High"
          />
          <Line
            yAxisId="price"
            type="monotone"
            dataKey="low"
            stroke={colors[4]}
            strokeWidth={1}
            dot={false}
            name="Low"
          />
          <Line
            yAxisId="price"
            type="monotone"
            dataKey="close"
            stroke={colors[0]}
            strokeWidth={2}
            dot={{ r: 2 }}
            name="Close"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default FinancialChart;
