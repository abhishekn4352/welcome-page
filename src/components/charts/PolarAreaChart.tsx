import React from 'react';
import {
  RadialBarChart,
  RadialBar,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import ChartWrapper from './ChartWrapper';
import { ChartDataPoint, ChartConfig, CHART_COLORS_HEX } from './types';

interface PolarAreaChartProps {
  data: ChartDataPoint[];
  config?: ChartConfig;
  className?: string;
}

const PolarAreaChart: React.FC<PolarAreaChartProps> = ({
  data,
  config = {},
  className,
}) => {
  const { title = 'Polar Area Chart', showLegend = true, colors = CHART_COLORS_HEX } = config;

  // Transform data for RadialBarChart
  const transformedData = data.map((item, index) => ({
    ...item,
    fill: colors[index % colors.length],
  }));

  return (
    <ChartWrapper title={title} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="10%"
          outerRadius="80%"
          barSize={15}
          data={transformedData}
          startAngle={180}
          endAngle={-180}
        >
          <RadialBar
            label={{ position: 'insideStart', fill: '#fff', fontSize: 10 }}
            background
            dataKey="value"
            cornerRadius={4}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          {showLegend && <Legend iconSize={10} />}
        </RadialBarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default PolarAreaChart;
