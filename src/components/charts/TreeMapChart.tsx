import React from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import ChartWrapper from './ChartWrapper';
import { ChartConfig, CHART_COLORS_HEX } from './types';

interface TreemapData {
  name: string;
  size?: number;
  children?: TreemapData[];
}

interface TreeMapChartProps {
  data: TreemapData[];
  config?: ChartConfig;
  className?: string;
}

const COLORS = CHART_COLORS_HEX;

const CustomizedContent: React.FC<any> = (props) => {
  const { x, y, width, height, index, name, depth } = props;

  if (width < 30 || height < 20) return null;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: COLORS[index % COLORS.length],
          stroke: '#fff',
          strokeWidth: 2,
          strokeOpacity: 1,
        }}
        rx={4}
      />
      {width > 50 && height > 25 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          fill="#fff"
          fontSize={depth === 1 ? 12 : 10}
          fontWeight={depth === 1 ? 600 : 400}
        >
          {name}
        </text>
      )}
    </g>
  );
};

const TreeMapChart: React.FC<TreeMapChartProps> = ({
  data,
  config = {},
  className,
}) => {
  const { title = 'Tree Map Chart' } = config;

  // Flatten data for Recharts Treemap
  const flattenedData = data.map((item, index) => ({
    name: item.name,
    size: item.size || (item.children?.reduce((acc, child) => acc + (child.size || 0), 0) || 0),
  }));

  return (
    <ChartWrapper title={title} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={flattenedData}
          dataKey="size"
          aspectRatio={4 / 3}
          stroke="#fff"
          fill="#8884d8"
          content={<CustomizedContent />}
        >
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
        </Treemap>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default TreeMapChart;
