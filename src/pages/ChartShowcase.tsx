import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  UnifiedChart,
  CommonFilter,
  CompactFilter,
  generateMockData,
  generatePieData,
  generateScatterData,
  generateBubbleData,
  generateHeatmapData,
  generateTreemapData,
  generateFunnelData,
  generateTimelineData,
  generateWaterfallData,
  generateFinancialData,
  generateTodoData,
  generateGridData,
  FilterOption,
  FilterState,
  ChartType,
} from '@/components/charts';

const chartTypes: { type: ChartType; label: string }[] = [
  { type: 'line', label: 'Line Chart' },
  { type: 'bar', label: 'Bar Chart' },
  { type: 'area', label: 'Area Chart' },
  { type: 'pie', label: 'Pie Chart' },
  { type: 'doughnut', label: 'Doughnut Chart' },
  { type: 'radar', label: 'Radar Chart' },
  { type: 'scatter', label: 'Scatter Chart' },
  { type: 'bubble', label: 'Bubble Chart' },
  { type: 'polar', label: 'Polar Area Chart' },
  { type: 'mixed', label: 'Mixed Chart' },
  { type: 'stacked-bar', label: 'Stacked Bar Chart' },
  { type: 'horizontal-bar', label: 'Horizontal Bar Chart' },
  { type: 'stacked-area', label: 'Stacked Area Chart' },
  { type: 'heatmap', label: 'Heatmap Chart' },
  { type: 'treemap', label: 'Tree Map Chart' },
  { type: 'funnel', label: 'Funnel Chart' },
  { type: 'gauge', label: 'Gauge Chart' },
  { type: 'timeline', label: 'Timeline Chart' },
  { type: 'waterfall', label: 'Waterfall Chart' },
  { type: 'financial', label: 'Financial Chart' },
  { type: 'map', label: 'Map Chart' },
  { type: 'todo', label: 'To-Do Chart' },
  { type: 'grid', label: 'Grid View' },
];

const filterOptions: FilterOption[] = [
  {
    id: 'timeRange',
    label: 'Time Range',
    type: 'select',
    options: [
      { value: '7d', label: 'Last 7 days' },
      { value: '30d', label: 'Last 30 days' },
      { value: '90d', label: 'Last 90 days' },
      { value: '1y', label: 'Last year' },
    ],
  },
  {
    id: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { value: 'all', label: 'All Categories' },
      { value: 'electronics', label: 'Electronics' },
      { value: 'clothing', label: 'Clothing' },
      { value: 'home', label: 'Home' },
    ],
  },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'pending', label: 'Pending' },
    ],
  },
  {
    id: 'region',
    label: 'Region',
    type: 'select',
    options: [
      { value: 'north', label: 'North' },
      { value: 'south', label: 'South' },
      { value: 'east', label: 'East' },
      { value: 'west', label: 'West' },
    ],
  },
];

const getDataForChart = (type: ChartType) => {
  switch (type) {
    case 'pie':
    case 'doughnut':
    case 'polar':
      return generatePieData();
    case 'scatter':
      return generateScatterData();
    case 'bubble':
      return generateBubbleData();
    case 'heatmap':
      return generateHeatmapData();
    case 'treemap':
      return generateTreemapData();
    case 'funnel':
      return generateFunnelData();
    case 'gauge':
      return { value: Math.floor(Math.random() * 100) };
    case 'timeline':
      return generateTimelineData();
    case 'waterfall':
      return generateWaterfallData();
    case 'financial':
      return generateFinancialData();
    case 'todo':
      return generateTodoData();
    case 'grid':
      return generateGridData();
    default:
      return generateMockData(8);
  }
};

const ChartShowcase: React.FC = () => {
  const [filterValues, setFilterValues] = useState<FilterState>({});
  const [compactFilterValues, setCompactFilterValues] = useState<FilterState>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/home" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-xl font-bold text-foreground">Chart Library</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Common Filter Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Common Filter</h2>
          <CommonFilter
            filters={filterOptions}
            values={filterValues}
            onChange={setFilterValues}
            onReset={() => setFilterValues({})}
          />
        </section>

        {/* Compact Filter Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Compact Filter</h2>
          <CompactFilter
            filters={filterOptions}
            values={compactFilterValues}
            onChange={setCompactFilterValues}
            onReset={() => setCompactFilterValues({})}
          />
        </section>

        {/* Charts Grid */}
        <section>
          <h2 className="text-lg font-semibold mb-4">All Charts ({chartTypes.length} types)</h2>
          <div className={
            viewMode === 'grid'
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-6"
          }>
            {chartTypes.map(({ type, label }) => (
              <div 
                key={type} 
                className={viewMode === 'list' ? 'h-80' : 'h-72'}
              >
                <UnifiedChart
                  type={type}
                  data={getDataForChart(type)}
                  config={{ title: label }}
                  className="h-full"
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ChartShowcase;
