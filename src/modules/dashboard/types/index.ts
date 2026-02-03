export interface Dashboard {
    id: number;
    name: string;
    description?: string;
    items: Widget[];
    // Legacy fields adapting to new structure
    dashboard_name?: string;
    dashboard_description?: string;
    dashbord1_Line?: any[];
}

export interface Widget {
    id: string; // Unique identifier for the grid item
    type: WidgetType;
    name: string;

    // Gridster/React-Grid-Layout properties
    x: number;
    y: number;
    w: number; // cols
    h: number; // rows

    // Configuration
    config: WidgetConfig;
}

export type WidgetType =
    | 'line_chart'
    | 'bar_chart'
    | 'pie_chart'
    | 'doughnut_chart'
    | 'radar_chart'
    | 'polar_area_chart'
    | 'scatter_chart'
    | 'bubble_chart'
    | 'table'
    | 'stat_card'
    | 'text_block';

export interface WidgetConfig {
    title?: string;
    dataSource?: 'api' | 'static' | 'database';

    // API/Data Source Config
    apiUrl?: string;
    dataKey?: string; // Key in the response to use as data array

    // Visual Config
    xAxisKey?: string;
    yAxisKey?: string;
    seriesKeys?: string[]; // For multi-series charts
    colors?: string[];

    // Specific settings
    refreshInterval?: number;

    // Drilldown
    drilldownEnabled?: boolean;
    drilldownTargetId?: number;
}
