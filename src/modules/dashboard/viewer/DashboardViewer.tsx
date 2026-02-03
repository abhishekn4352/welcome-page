import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
// @ts-ignore
import { EnhancedCanvas } from '../canvas/EnhancedCanvas';
// @ts-ignore
import WidgetNode from '../canvas/components/WidgetNode';
import { useDashboardViewer } from './useDashboardViewer';
import { dashboardService } from '../services/dashboard.service';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CompactFilter, { CompactFilterConfig } from './components/CompactFilter';

const ROW_HEIGHT = 60;
const COL_WIDTH = 100;

const DashboardViewer = () => {
    const { layouts, dashboardName, loading: configLoading, error: configError, filters } = useDashboardViewer();
    const navigate = useNavigate();

    // React Flow state
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // Global filter state
    const [filterValues, setFilterValues] = useState<Record<string, any>>({});
    // Embedded Individual filter state: Record<NodeID, Record<FilterKey, FilterValue>>
    const [individualFilterValues, setIndividualFilterValues] = useState<Record<string, Record<string, any>>>({});

    // Config node types
    const nodeTypes = useMemo(() => ({
        'widget-barchart': WidgetNode,
        'widget-linechart': WidgetNode,
        'widget-piechart': WidgetNode,
        'widget-radarchart': WidgetNode,
        'widget-areachart': WidgetNode,
        'widget-scatterchart': WidgetNode,
        'widget-doughnutchart': WidgetNode,
        'widget-compositechart': WidgetNode,
        // Fallback or generic types
        'smartChart': WidgetNode,
        'compact-filter': WidgetNode // Register for filter nodes
    }), []);

    // Drill-down history state: Record<NodeID, Array<{ config: any, filters: any }>>
    const [drillHistory, setDrillHistory] = useState<Record<string, Array<{ config: any, filters: any }>>>({});

    const handleFilterChange = useCallback((key: string, value: any) => {
        setFilterValues(prev => ({
            ...prev,
            [key]: value
        }));
    }, []);

    const handleIndividualFilterChange = useCallback((nodeId: string, key: string, value: any) => {
        setIndividualFilterValues(prev => ({
            ...prev,
            [nodeId]: {
                ...(prev[nodeId] || {}),
                [key]: value
            }
        }));
    }, []);

    // Handle Drill Down
    const handleDrillDown = useCallback((nodeId: string, clickedValue: any, clickedCategory: string) => {
        setNodes((nds) => nds.map((node) => {
            if (node.id !== nodeId) return node;

            const currentConfig = node.data.config;

            // 1. Check if drill down is enabled
            if (!currentConfig.drilldownEnabled && (!currentConfig.drilldownLayers || currentConfig.drilldownLayers.length === 0)) {
                return node;
            }

            // 2. Determine next configuration
            // Check for layers first (multi-level)
            let nextConfig = { ...currentConfig };
            let usedLayerIndex = -1;

            if (currentConfig.drilldownLayers && currentConfig.drilldownLayers.length > 0) {
                // Find the next enabled layer or just take the first one if we are at root?
                // Logic: If we are already drilled, we need to know "where" we are.
                // We can infer level from history length.
                const currentLevel = (drillHistory[nodeId] || []).length;
                if (currentLevel < currentConfig.drilldownLayers.length) {
                    const layer = currentConfig.drilldownLayers[currentLevel];
                    // Apply layer config
                    nextConfig = {
                        ...nextConfig,
                        table: layer.apiUrl || nextConfig.table, // override API
                        xAxis: layer.xAxis || nextConfig.xAxis,
                        yAxis: layer.yAxis || nextConfig.yAxis,
                        // Filters for next level:
                        baseFilters: currentConfig.drilldownFilters || [], // Switch to drilldown filters
                    };
                    usedLayerIndex = currentLevel;
                } else {
                    // No more layers
                    return node;
                }
            } else {
                // Single level drill down (legacy properties)
                nextConfig = {
                    ...nextConfig,
                    table: currentConfig.drilldownApiUrl || nextConfig.table,
                    xAxis: currentConfig.drilldownXAxis || nextConfig.xAxis,
                    yAxis: currentConfig.drilldownYAxis || nextConfig.yAxis,
                    baseFilters: currentConfig.drilldownFilters || [], // Switch to drilldown filters
                    drilldownEnabled: false // Disable further drilling if single level
                };
            }

            // 3. Save History
            const historyItem = {
                config: currentConfig,
                filters: individualFilterValues[nodeId] || {}
            };

            setDrillHistory(prev => ({
                ...prev,
                [nodeId]: [...(prev[nodeId] || []), historyItem]
            }));

            // 4. Update Node with new Config and Apply Clicked Value as Filter
            // The clicked category (e.g. "productLine") becomes a filter with value `clickedValue`
            // The parameter name might be defined in `drilldownParameter` or imply from xAxis
            const paramName = currentConfig.drilldownParameter || currentConfig.xAxis || clickedCategory;

            // Apply new filter
            setIndividualFilterValues(prev => ({
                ...prev,
                [nodeId]: {
                    ...(prev[nodeId] || {}),
                    [paramName]: clickedValue
                }
            }));

            return {
                ...node,
                data: {
                    ...node.data,
                    config: nextConfig,
                    isDrilled: true
                }
            };
        }));
    }, [drillHistory, individualFilterValues, setNodes]);

    // 1. Layout Parsing
    useEffect(() => {
        if (!layouts || layouts.length === 0) return;

        const initialNodes = layouts.map((item: any, index: number) => {
            const width = (item.cols || 4) * COL_WIDTH;
            const height = (item.rows || 6) * ROW_HEIGHT;
            const x = (item.x || 0) * COL_WIDTH;
            const y = (item.y || 0) * ROW_HEIGHT;

            // Determine type
            let type = 'smartChart';
            // Check for Compact Filter first
            if (item.component === 'Compact Filter') {
                type = 'compact-filter';
            } else {
                // Map legacy chart type
                const legacyType = (item.chartType || '').toLowerCase();
                if (legacyType.includes('bar')) type = 'widget-barchart';
                else if (legacyType.includes('line')) type = 'widget-linechart';
                else if (legacyType.includes('pie')) type = 'widget-piechart';
                else if (legacyType.includes('radar')) type = 'widget-radarchart';
                else if (legacyType.includes('area')) type = 'widget-areachart';
                else if (legacyType.includes('scatter')) type = 'widget-scatterchart';
                else if (legacyType.includes('doughnut')) type = 'widget-doughnutchart';
            }

            const nodeId = `node-${index}-${item.chartid || Math.random().toString().substr(2, 5)}`;

            return {
                id: nodeId,
                type,
                position: { x, y },
                draggable: true,
                selectable: true,
                zIndex: type === 'compact-filter' ? 1000 : 1, // Ensure filters stay on top
                data: {
                    config: item, // Store raw config
                    title: item.charttitle || item.name,
                    width,
                    height,
                    serverId: item.chartid,
                    widgetType: type,
                    layout: { width, height },

                    // Global Context
                    globalFilters: filterValues,
                    onGlobalFilterChange: handleFilterChange,

                    // Individual Context
                    individualFilters: individualFilterValues[nodeId] || {},
                    onIndividualFilterChange: handleIndividualFilterChange,

                    onResizeNode: (id: string, dir: any, delta: any, dimensions: any) => {
                        setNodes((nds) => nds.map((node) => {
                            if (node.id === id) {
                                return {
                                    ...node,
                                    width: dimensions.width,
                                    height: dimensions.height,
                                    style: { ...node.style, width: dimensions.width, height: dimensions.height },
                                    data: {
                                        ...node.data,
                                        width: dimensions.width,
                                        height: dimensions.height
                                    }
                                };
                            }
                            return node;
                        }));
                    }
                }
            };
        });

        setNodes(initialNodes);
    }, [layouts, setNodes, handleFilterChange, handleIndividualFilterChange]);

    // Handle Drill Up
    const handleDrillUp = useCallback((nodeId: string) => {
        setNodes((nds) => nds.map((node) => {
            if (node.id !== nodeId) return node;

            const history = drillHistory[nodeId];
            if (!history || history.length === 0) return node;

            // Pop last state
            const previousState = history[history.length - 1];
            const newHistory = history.slice(0, -1);

            setDrillHistory(prev => ({
                ...prev,
                [nodeId]: newHistory
            }));

            // Restore Filters
            setIndividualFilterValues(prev => ({
                ...prev,
                [nodeId]: previousState.filters
            }));

            // Restore Config
            return {
                ...node,
                data: {
                    ...node.data,
                    config: previousState.config,
                    isDrilled: newHistory.length > 0
                }
            };
        }));
    }, [drillHistory, setNodes]);

    // Update nodes when filters change to propagate new values
    useEffect(() => {
        setNodes((nds) => nds.map((node) => ({
            ...node,
            data: {
                ...node.data,
                globalFilters: filterValues,
                onGlobalFilterChange: handleFilterChange,

                // Propagate individual filters specifically for this node
                individualFilters: individualFilterValues[node.id] || {},
                onIndividualFilterChange: handleIndividualFilterChange,

                // Drill down props
                onDrillDown: handleDrillDown,
                onDrillUp: handleDrillUp,
                canDrillUp: (drillHistory[node.id] && drillHistory[node.id].length > 0)
            }
        })));
    }, [filterValues, individualFilterValues, drillHistory, setNodes, handleFilterChange, handleIndividualFilterChange, handleDrillDown, handleDrillUp]);

    // 2. Data Fetching: Centralized fetching that reacts to nodes and FILTERS
    useEffect(() => {
        if (nodes.length === 0) return;

        // Debounce or check usage to prevent infinite loops if we were setting nodes dependency directly
        // But here we iterate existing nodes in state.

        nodes.forEach(async (node) => {
            // Only fetch for charts that have a table configuration
            if (!node.data.config?.table) return;

            // Important: We allow re-fetching even if 'data' exists, if we want filters to apply.
            // But we need to avoid infinite loop. 
            // The trick: checks if the current loaded data matches the current filters? 
            // Or simplified: Just fetch. 
            // Since this useEffect depends on [filterValues], it runs once when filter changes.
            // But 'nodes' is also here? No, let's change dependency to [filterValues, layouts] (initial load)
            // Actually, we can just run this effect when filterValues changes.

            // To be safe, we'll fetch for all chart nodes when filterValues changes.

            try {
                const config = node.data.config;
                // Ensure yAxis is a string for the API call
                const yAxis = Array.isArray(config.yAxis) ? config.yAxis.join(',') : config.yAxis;

                // Construct filters
                let filters = '';
                const filterObj: Record<string, any> = {};

                // 1. Add Base Filters
                if (config.baseFilters && Array.isArray(config.baseFilters)) {
                    config.baseFilters.forEach((f: any) => {
                        if (f.field && f.value) filterObj[f.field] = f.value;
                    });
                }

                // 2. Merge Global Filters
                if (filterValues) {
                    Object.entries(filterValues).forEach(([key, value]) => {
                        if (value) filterObj[key] = value;
                    });
                }

                // 3. Merge Embedded Individual Filters (Highest Priority for this specific chart)
                if (individualFilterValues[node.id]) {
                    Object.entries(individualFilterValues[node.id]).forEach(([key, value]) => {
                        if (value) filterObj[key] = value;
                    });
                }

                if (Object.keys(filterObj).length > 0) filters = JSON.stringify(filterObj);

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
                    // Transform Data for WidgetNode (Recharts)
                    let formattedData: any[] = [];

                    if (response.chartData && response.chartLabels && Array.isArray(response.chartData) && response.chartLabels.length > 0) {
                        // Standard Legacy: transform to { name: label, value: data } or complex objects
                        if (typeof response.chartData[0] === 'object') {
                            const labels = response.chartLabels;
                            const datasets = response.chartData;
                            formattedData = labels.map((label: string, idx: number) => {
                                const point: any = { name: label };
                                datasets.forEach((ds: any) => {
                                    point[ds.label || 'value'] = ds.data[idx];
                                });
                                return point;
                            });
                        } else {
                            formattedData = response.chartLabels.map((label: string, idx: number) => ({
                                name: label,
                                value: response.chartData[idx]
                            }));
                        }
                    } else if (response.chartData && Array.isArray(response.chartData)) {
                        formattedData = response.chartData;
                    }

                    // Update Node with new data preserving layout
                    setNodes((nds) => nds.map((n) => {
                        if (n.id === node.id) {
                            return {
                                ...n,
                                data: {
                                    ...n.data,
                                    config: {
                                        ...n.data.config,
                                        data: formattedData,
                                        // Legacy support for specific widgets
                                        bars: formattedData.map((d) => ({
                                            label: d.name,
                                            value: d.value
                                        })),
                                        // Support Pie/Line etc if they look for other props
                                        labels: formattedData.map(d => d.name),
                                        datasets: [{ data: formattedData.map(d => d.value) }]
                                    }
                                }
                            };
                        }
                        return n;
                    }));
                }
            } catch (err) {
                console.error(`[Viewer] Error fetching for ${node.id}`, err);
            }
        });
    }, [filterValues, individualFilterValues, layouts, nodes.length]); // Re-run when filters change or layouts (initial) load. Also when node count changes (initial load).

    if (configLoading) return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="text-lg font-medium text-blue-600 animate-pulse">Loading Dashboard...</div>
        </div>
    );

    if (configError) return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="text-red-500 bg-white p-4 rounded shadow">Error: {configError}</div>
        </div>
    );

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b px-6 py-4 shadow-sm flex items-center gap-4 z-10 sticky top-0">
                <button
                    onClick={() => navigate('/dashboards')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-bold text-gray-800">{dashboardName}</h1>
            </div>

            {/* Filter Bar Removed - Filters are now widgets on the canvas */}

            <div className="flex-1 w-full h-full relative">
                <EnhancedCanvas
                    nodes={nodes}
                    edges={[]} // Force empty edges to remove visual links
                    onNodesChange={onNodesChange}
                    // onEdgesChange={onEdgesChange} // Disable edge changes
                    nodeTypes={nodeTypes}
                    isExecuting={false}
                    readOnly={false} // Enable interaction for resize/drag
                    nodesDraggable={true} // Allow individual movement
                    nodesConnectable={false} // Disable connections
                    diagramId="dashboard-viewer"
                    // Standard exclusive selection on click
                    onNodeClick={(_, clickedNode) => {
                        setNodes((nds) => nds.map((n) => ({
                            ...n,
                            selected: n.id === clickedNode.id
                        })));
                    }}
                    onPaneClick={() => {
                        setNodes((nds) => nds.map((n) => ({ ...n, selected: false })));
                    }}
                />
            </div>
        </div>
    );
};

export default DashboardViewer;
