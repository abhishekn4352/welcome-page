import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import ChartWrapper from './ChartWrapper';
import { ChartDataPoint, ChartConfig, CHART_COLORS_HEX } from './types';

interface BarChartComponentProps {
  data: ChartDataPoint[];
  config?: ChartConfig;
  dataKeys?: string[];
  className?: string;
  stacked?: boolean;
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({
  data,
  config = {},
  dataKeys = ['value', 'value2'],
  className,
  stacked = false,
}) => {
  const { title = 'Bar Chart', showLegend = true, showGrid = true, colors = CHART_COLORS_HEX } = config;

  return (
    <ChartWrapper title={title} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
          {dataKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={colors[index % colors.length]}
              radius={[4, 4, 0, 0]}
              stackId={stacked ? 'stack' : undefined}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default BarChartComponent;
