import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import ChartWrapper from './ChartWrapper';
import { ChartDataPoint, ChartConfig, CHART_COLORS_HEX } from './types';

interface RadarChartComponentProps {
  data: ChartDataPoint[];
  config?: ChartConfig;
  dataKeys?: string[];
  className?: string;
}

const RadarChartComponent: React.FC<RadarChartComponentProps> = ({
  data,
  config = {},
  dataKeys = ['value', 'value2'],
  className,
}) => {
  const { title = 'Radar Chart', showLegend = true, colors = CHART_COLORS_HEX } = config;

  return (
    <ChartWrapper title={title} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid className="stroke-muted" />
          <PolarAngleAxis 
            dataKey="name" 
            tick={{ fontSize: 11 }}
            className="text-muted-foreground"
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 'auto']}
            tick={{ fontSize: 10 }}
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
            <Radar
              key={key}
              name={key}
              dataKey={key}
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
              fillOpacity={0.3}
              strokeWidth={2}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default RadarChartComponent;
