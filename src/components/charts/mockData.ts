import { ChartDataPoint } from './types';

// Generate mock data for different chart types
export const generateMockData = (count: number = 6): ChartDataPoint[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.slice(0, count).map((month, i) => ({
    name: month,
    value: Math.floor(Math.random() * 500) + 100,
    value2: Math.floor(Math.random() * 400) + 50,
    value3: Math.floor(Math.random() * 300) + 25,
  }));
};

export const generatePieData = (): ChartDataPoint[] => [
  { name: 'Product A', value: 400 },
  { name: 'Product B', value: 300 },
  { name: 'Product C', value: 200 },
  { name: 'Product D', value: 150 },
  { name: 'Other', value: 100 },
];

export const generateScatterData = (): ChartDataPoint[] => 
  Array.from({ length: 30 }, (_, i) => ({
    name: `Point ${i + 1}`,
    value: Math.random() * 100,
    value2: Math.random() * 100,
  }));

export const generateBubbleData = (): ChartDataPoint[] =>
  Array.from({ length: 20 }, (_, i) => ({
    name: `Item ${i + 1}`,
    value: Math.random() * 100,
    value2: Math.random() * 100,
    value3: Math.floor(Math.random() * 50) + 10,
  }));

export const generateHeatmapData = (): { x: string; y: string; value: number }[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const data: { x: string; y: string; value: number }[] = [];
  
  days.forEach(day => {
    hours.forEach(hour => {
      data.push({
        x: hour,
        y: day,
        value: Math.floor(Math.random() * 100),
      });
    });
  });
  
  return data;
};

export const generateTreemapData = () => [
  { name: 'Electronics', size: 4500, children: [
    { name: 'Phones', size: 2000 },
    { name: 'Laptops', size: 1500 },
    { name: 'Tablets', size: 1000 },
  ]},
  { name: 'Clothing', size: 3000, children: [
    { name: 'Men', size: 1500 },
    { name: 'Women', size: 1500 },
  ]},
  { name: 'Home', size: 2000 },
  { name: 'Sports', size: 1500 },
];

export const generateFunnelData = (): ChartDataPoint[] => [
  { name: 'Visits', value: 10000 },
  { name: 'Cart', value: 6500 },
  { name: 'Checkout', value: 4200 },
  { name: 'Payment', value: 3100 },
  { name: 'Completed', value: 2400 },
];

export const generateGaugeData = () => ({
  value: Math.floor(Math.random() * 100),
  min: 0,
  max: 100,
  segments: [
    { start: 0, end: 30, color: '#ef4444' },
    { start: 30, end: 70, color: '#f59e0b' },
    { start: 70, end: 100, color: '#10b981' },
  ],
});

export const generateTimelineData = () => [
  { date: '2024-01-15', event: 'Project Started', type: 'milestone' },
  { date: '2024-02-01', event: 'Phase 1 Complete', type: 'milestone' },
  { date: '2024-03-10', event: 'Beta Release', type: 'release' },
  { date: '2024-04-20', event: 'Public Launch', type: 'release' },
  { date: '2024-05-15', event: 'v2.0 Released', type: 'release' },
];

export const generateWaterfallData = (): ChartDataPoint[] => [
  { name: 'Start', value: 1000, category: 'start' },
  { name: 'Revenue', value: 500, category: 'positive' },
  { name: 'Expenses', value: -200, category: 'negative' },
  { name: 'Tax', value: -100, category: 'negative' },
  { name: 'Investment', value: 300, category: 'positive' },
  { name: 'End', value: 1500, category: 'end' },
];

export const generateFinancialData = () => 
  Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (30 - i));
    const open = 100 + Math.random() * 50;
    const close = open + (Math.random() - 0.5) * 10;
    const high = Math.max(open, close) + Math.random() * 5;
    const low = Math.min(open, close) - Math.random() * 5;
    return {
      date: date.toISOString().split('T')[0],
      open,
      high,
      low,
      close,
      volume: Math.floor(Math.random() * 1000000),
    };
  });

export const generateTodoData = () => [
  { id: 1, title: 'Complete dashboard design', status: 'done', priority: 'high' },
  { id: 2, title: 'Implement API integration', status: 'in-progress', priority: 'high' },
  { id: 3, title: 'Write documentation', status: 'todo', priority: 'medium' },
  { id: 4, title: 'Code review', status: 'todo', priority: 'low' },
  { id: 5, title: 'Deploy to production', status: 'todo', priority: 'high' },
];

export const generateGridData = () =>
  Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    category: ['Electronics', 'Clothing', 'Home', 'Sports'][Math.floor(Math.random() * 4)],
    price: Math.floor(Math.random() * 500) + 50,
    stock: Math.floor(Math.random() * 100),
    status: ['Active', 'Inactive', 'Pending'][Math.floor(Math.random() * 3)],
  }));
