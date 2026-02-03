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

interface HorizontalBarChartProps {
  data: ChartDataPoint[];
  config?: ChartConfig;
  dataKeys?: string[];
  className?: string;
}

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  data,
  config = {},
  dataKeys = ['value'],
  className,
}) => {
  const { title = 'Horizontal Bar Chart', showLegend = true, showGrid = true, colors = CHART_COLORS_HEX } = config;

  return (
    <ChartWrapper title={title} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          layout="vertical"
          margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />}
          <XAxis 
            type="number"
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
          />
          <YAxis 
            type="category"
            dataKey="name"
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
            width={50}
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
              radius={[0, 4, 4, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default HorizontalBarChart;
