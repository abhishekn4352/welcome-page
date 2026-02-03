import React from 'react';
import * as ReactGridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Save, BarChart2, PieChart, Activity } from 'lucide-react';
import WidgetRenderer from './components/WidgetRenderer';
import { useDashboardEditor } from './useDashboardEditor';

// Robust extraction of WidthProvider and Responsive
// Some builds export them on the default object, others as named exports
// @ts-ignore
const RGL = ReactGridLayout.default || ReactGridLayout;
// @ts-ignore
const WidthProvider = ReactGridLayout.WidthProvider || RGL?.WidthProvider || window.WidthProvider;
// @ts-ignore
const Responsive = ReactGridLayout.Responsive || RGL?.Responsive || window.Responsive;

console.log('RGL Import Debug:', {
    ReactGridLayoutKeys: Object.keys(ReactGridLayout),
    RGL,
    WidthProvider,
    Responsive
});

if (!WidthProvider || !Responsive) {
    console.error("React-Grid-Layout imports failed completely", { WidthProvider, Responsive });
}

if (!WidthProvider) {
    console.error("React-Grid-Layout WidthProvider not found", RGL);
}

const ResponsiveGridLayout = WidthProvider ? WidthProvider(Responsive) : null;

const DashboardEditor = () => {
    const {
        dashboard,
        setDashboard,
        loading,
        saving,
        handleLayoutChange,
        addWidget,
        handleSave
    } = useDashboardEditor();

    if (loading) return <div className="p-8 text-center">Loading editor...</div>;
    if (!dashboard) return <div className="p-8 text-center text-red-500">Dashboard not found</div>;

    return (
        <div className="flex h-screen flex-col bg-gray-50">
            {/* Toolbar */}
            <div className="flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        value={dashboard.name}
                        onChange={(e) => setDashboard({ ...dashboard, name: e.target.value })}
                        className="text-lg font-bold text-gray-900 border-none focus:ring-0 p-0"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => addWidget('line_chart')} className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="Add Line Chart"><Activity size={20} /></button>
                    <button onClick={() => addWidget('bar_chart')} className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="Add Bar Chart"><BarChart2 size={20} /></button>
                    <button onClick={() => addWidget('pie_chart')} className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="Add Pie Chart"><PieChart size={20} /></button>
                    <div className="w-px h-6 bg-gray-300 mx-2"></div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        <Save size={16} />
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            {/* Grid Area */}
            <div className="flex-1 overflow-auto p-4 content-box">
                {ResponsiveGridLayout ? (
                    <ResponsiveGridLayout
                        className="layout"
                        layouts={{ lg: dashboard.items.map(item => ({ ...item, i: item.id.toString() })) }}
                        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                        rowHeight={60}
                        onLayoutChange={handleLayoutChange}
                        draggableHandle=".drag-handle"
                    >
                        {dashboard.items.map((item) => (
                            <div key={item.id} className="relative overflow-hidden rounded-lg border bg-white shadow-sm ring-1 ring-black/5">
                                {/* Drag Handle Overlay */}
                                <div className="drag-handle absolute top-0 left-0 w-full h-8 z-10 cursor-move hover:bg-gray-50/20"></div>

                                <div className="h-full w-full pt-2">
                                    <WidgetRenderer widget={item} />
                                </div>
                            </div>
                        ))}
                    </ResponsiveGridLayout>
                ) : (
                    <div className="p-4 text-red-500">
                        Error loading Grid Layout library. Please check console.
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardEditor;
