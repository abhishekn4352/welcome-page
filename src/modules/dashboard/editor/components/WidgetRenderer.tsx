import React from 'react';
import { Widget, WidgetType } from '../../types';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface WidgetRendererProps {
    widget: Widget;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Mock Data Generator
const getData = () => [
    { name: 'Jan', value: 400, value2: 240 },
    { name: 'Feb', value: 300, value2: 139 },
    { name: 'Mar', value: 200, value2: 980 },
    { name: 'Apr', value: 278, value2: 390 },
    { name: 'May', value: 189, value2: 480 },
];

const WidgetRenderer: React.FC<WidgetRendererProps> = ({ widget }) => {
    const data = getData();

    const renderChart = () => {
        switch (widget.type) {
            case 'line_chart':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" />
                            <Line type="monotone" dataKey="value2" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                );
            case 'bar_chart':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" />
                            <Bar dataKey="value2" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'pie_chart':
            case 'doughnut_chart':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={widget.type === 'doughnut_chart' ? 60 : 0}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                );
            case 'stat_card':
                return (
                    <div className="flex flex-col items-center justify-center h-full">
                        <span className="text-4xl font-bold text-blue-600">1,234</span>
                        <span className="text-gray-500">Active Users</span>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        Unsupported Widget Type: {widget.type}
                    </div>
                );
        }
    };

    return (
        <div className="h-full w-full flex flex-col">
            <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-medium text-gray-700 text-sm">{widget.name || 'Untitled Widget'}</h3>
            </div>
            <div className="flex-1 p-4 min-h-0">
                {renderChart()}
            </div>
        </div>
    );
};

export default WidgetRenderer;
