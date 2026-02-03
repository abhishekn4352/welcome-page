import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { dashboardService } from '../../services/dashboard.service';

interface SmartWidgetProps {
    config: any;
    globalFilters?: Record<string, any>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const SmartWidget: React.FC<SmartWidgetProps> = ({ config, globalFilters }) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!config.table || !config.xAxis || !config.chartType) {
                return;
            }

            setLoading(true);
            try {
                // Ensure yAxis is a string for the API call
                const yAxis = Array.isArray(config.yAxis) ? config.yAxis.join(',') : config.yAxis;

                // Construct filters matching legacy logic: { field: value }
                let filters = '';
                const filterObj: Record<string, any> = {};

                // 1. Add Base Filters (from config)
                if (config.baseFilters && Array.isArray(config.baseFilters) && config.baseFilters.length > 0) {
                    config.baseFilters.forEach((filter: any) => {
                        // Only add if both field and value are present and not empty
                        if (filter.field && filter.value !== undefined && filter.value !== null && filter.value !== '') {
                            filterObj[filter.field] = filter.value;
                        }
                    });
                }

                // 2. Add Global Filters (merged, potentially overriding base filters)
                if (globalFilters) {
                    Object.entries(globalFilters).forEach(([key, value]) => {
                        // Handle date range specifically if needed, or assume value is string/number
                        if (value !== undefined && value !== null && value !== '') {
                            // If Date Range (object with start/end), you might need specific logic depending on Backend API expectations
                            // For now assuming the backend handles whatever logic legacy did (legacy sent date range as value?)
                            // Legacy passed value directly. 
                            filterObj[key] = value;
                        }
                    });
                }

                if (Object.keys(filterObj).length > 0) {
                    filters = JSON.stringify(filterObj);
                }

                const response = await dashboardService.getChartData(
                    config.table,
                    config.chartType,
                    config.xAxis,
                    yAxis,
                    config.connection ? Number(config.connection) : undefined,
                    undefined,
                    undefined,
                    filters
                );


                if (response) {
                    // Normalize data for Recharts
                    let formattedData: any[] = [];

                    if (response.chartLabels && response.chartData) {
                        // Standard Legacy Format: labels: ['A'], data: [10]
                        formattedData = response.chartLabels.map((label: string, index: number) => ({
                            name: label,
                            value: response.chartData[index]
                        }));
                    } else if (response.labels && response.datasets) {
                        // Alternate Legacy Format
                        const dataset = response.datasets[0];
                        formattedData = response.labels.map((label: string, index: number) => ({
                            name: label,
                            value: dataset ? dataset.data[index] : 0
                        }));
                    } else if (Array.isArray(response)) {
                        // Direct array (rare but possible)
                        formattedData = response;
                    }

                    setData(formattedData);
                }
            } catch (err: any) {
                console.error(`[SmartWidget] Error:`, err);
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [config, globalFilters]);

    if (loading) return <div className="flex h-full items-center justify-center text-gray-400 text-xs">Loading...</div>;
    if (error) return <div className="flex h-full items-center justify-center text-red-400 text-xs">{error}</div>;
    if (!data.length) return <div className="flex h-full items-center justify-center text-gray-400 text-xs">No Data</div>;

    const renderChart = () => {
        const type = (config.chartType || 'bar').toLowerCase();

        switch (type) {
            case 'line':
            case 'line_chart':
                return (
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                );
            case 'pie':
            case 'pie_chart':
                return (
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                );
            case 'bar':
            case 'bar_chart':
            default:
                return (
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                );
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-white p-2 rounded shadow-sm border border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 truncate" title={config.charttitle || config.name}>
                {config.charttitle || config.name}
            </h4>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SmartWidget;
