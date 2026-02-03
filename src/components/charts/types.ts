// Chart types supported by the library
export type ChartType =
  | 'line'
  | 'bar'
  | 'pie'
  | 'doughnut'
  | 'radar'
  | 'polar'
  | 'scatter'
  | 'bubble'
  | 'area'
  | 'stacked-bar'
  | 'horizontal-bar'
  | 'stacked-area'
  | 'mixed'
  | 'heatmap'
  | 'treemap'
  | 'funnel'
  | 'gauge'
  | 'timeline'
  | 'waterfall'
  | 'financial'
  | 'map'
  | 'todo'
  | 'grid';

export interface ChartDataPoint {
  name: string;
  value: number;
  value2?: number;
  value3?: number;
  category?: string;
  color?: string;
  [key: string]: any;
}

export interface ChartConfig {
  title?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  colors?: string[];
  animate?: boolean;
  stacked?: boolean;
  horizontal?: boolean;
}

export interface FilterOption {
  id: string;
  label: string;
  type: 'select' | 'date' | 'dateRange' | 'text' | 'multiSelect' | 'toggle';
  options?: { value: string; label: string }[];
  value?: any;
}

export interface FilterState {
  [key: string]: any;
}

// Default chart colors following design system
export const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(220, 70%, 50%)',
  'hsl(160, 60%, 45%)',
  'hsl(340, 75%, 55%)',
  'hsl(45, 90%, 55%)',
  'hsl(280, 65%, 55%)',
  'hsl(200, 80%, 50%)',
];

// Fallback colors for Recharts (needs hex/rgb)
export const CHART_COLORS_HEX = [
  '#6366f1', // primary indigo
  '#f97316', // accent orange
  '#3b82f6', // blue
  '#10b981', // emerald
  '#ec4899', // pink
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#06b6d4', // cyan
];
