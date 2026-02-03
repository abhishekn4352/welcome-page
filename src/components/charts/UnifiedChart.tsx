import React from 'react';
import { ChartType, ChartDataPoint, ChartConfig } from './types';
import LineChartComponent from './LineChart';
import BarChartComponent from './BarChart';
import PieChartComponent from './PieChart';
import DoughnutChart from './DoughnutChart';
import AreaChartComponent from './AreaChart';
import RadarChartComponent from './RadarChart';
import ScatterChartComponent from './ScatterChart';
import BubbleChart from './BubbleChart';
import MixedChart from './MixedChart';
import StackedBarChart from './StackedBarChart';
import HorizontalBarChart from './HorizontalBarChart';
import StackedAreaChart from './StackedAreaChart';
import PolarAreaChart from './PolarAreaChart';
import TreeMapChart from './TreeMapChart';
import FunnelChart from './FunnelChart';
import GaugeChart from './GaugeChart';
import TimelineChart from './TimelineChart';
import WaterfallChart from './WaterfallChart';
import FinancialChart from './FinancialChart';
import HeatmapChart from './HeatmapChart';
import MapChart from './MapChart';
import TodoChart from './TodoChart';
import GridView from './GridView';
import ChartWrapper from './ChartWrapper';

interface UnifiedChartProps {
  type: ChartType;
  data: any;
  config?: ChartConfig;
  className?: string;
  [key: string]: any;
}

const UnifiedChart: React.FC<UnifiedChartProps> = ({
  type,
  data,
  config = {},
  className,
  ...props
}) => {
  switch (type) {
    case 'line':
      return <LineChartComponent data={data} config={config} className={className} {...props} />;
    
    case 'bar':
      return <BarChartComponent data={data} config={config} className={className} {...props} />;
    
    case 'pie':
      return <PieChartComponent data={data} config={config} className={className} />;
    
    case 'doughnut':
      return <DoughnutChart data={data} config={config} className={className} {...props} />;
    
    case 'area':
      return <AreaChartComponent data={data} config={config} className={className} {...props} />;
    
    case 'radar':
      return <RadarChartComponent data={data} config={config} className={className} {...props} />;
    
    case 'scatter':
      return <ScatterChartComponent data={data} config={config} className={className} />;
    
    case 'bubble':
      return <BubbleChart data={data} config={config} className={className} />;
    
    case 'mixed':
      return <MixedChart data={data} config={config} className={className} />;
    
    case 'stacked-bar':
      return <StackedBarChart data={data} config={config} className={className} {...props} />;
    
    case 'horizontal-bar':
      return <HorizontalBarChart data={data} config={config} className={className} {...props} />;
    
    case 'stacked-area':
      return <StackedAreaChart data={data} config={config} className={className} {...props} />;
    
    case 'polar':
      return <PolarAreaChart data={data} config={config} className={className} />;
    
    case 'treemap':
      return <TreeMapChart data={data} config={config} className={className} />;
    
    case 'funnel':
      return <FunnelChart data={data} config={config} className={className} />;
    
    case 'gauge':
      return <GaugeChart value={data.value || 75} config={config} className={className} {...props} />;
    
    case 'timeline':
      return <TimelineChart data={data} config={config} className={className} />;
    
    case 'waterfall':
      return <WaterfallChart data={data} config={config} className={className} />;
    
    case 'financial':
      return <FinancialChart data={data} config={config} className={className} {...props} />;
    
    case 'heatmap':
      return <HeatmapChart data={data} config={config} className={className} />;
    
    case 'map':
      return <MapChart data={data} config={config} className={className} />;
    
    case 'todo':
      return <TodoChart data={data} config={config} className={className} {...props} />;
    
    case 'grid':
      return <GridView data={data} config={config} className={className} {...props} />;
    
    default:
      return (
        <ChartWrapper title="Unsupported Chart" className={className}>
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Chart type "{type}" is not supported
          </div>
        </ChartWrapper>
      );
  }
};

export default UnifiedChart;
