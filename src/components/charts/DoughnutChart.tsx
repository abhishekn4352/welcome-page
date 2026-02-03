import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import ChartWrapper from './ChartWrapper';
import { ChartDataPoint, ChartConfig, CHART_COLORS_HEX } from './types';

interface DoughnutChartProps {
  data: ChartDataPoint[];
  config?: ChartConfig;
  className?: string;
  centerLabel?: string;
  centerValue?: string | number;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({
  data,
  config = {},
  className,
  centerLabel,
  centerValue,
}) => {
  const { title = 'Doughnut Chart', showLegend = true, colors = CHART_COLORS_HEX } = config;

  return (
    <ChartWrapper title={title} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius="85%"
            innerRadius="60%"
            dataKey="value"
            nameKey="name"
            paddingAngle={3}
          >
            {data.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]}
                className="stroke-background"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          {showLegend && <Legend />}
          {/* Center text */}
          {(centerLabel || centerValue) && (
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              <tspan x="50%" dy="-0.5em" className="fill-foreground font-bold text-xl">
                {centerValue}
              </tspan>
              <tspan x="50%" dy="1.5em" className="fill-muted-foreground text-xs">
                {centerLabel}
              </tspan>
            </text>
          )}
        </PieChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default DoughnutChart;
