import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { dashboardService } from '../services/dashboard.service';
import { Dashboard, Widget, WidgetType } from '../types';

export const useDashboardEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState<Dashboard | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (id === 'new') {
            setDashboard({
                id: 0,
                name: 'New Dashboard',
                items: []
            });
            setLoading(false);
        } else {
            fetchDashboard(id!);
        }
    }, [id]);

    const fetchDashboard = async (dashId: string) => {
        try {
            const response: any = await dashboardService.getDashboardById(dashId);
            const data = response.item || response;

            let items: Widget[] = [];

            // Log the raw response for debugging
            console.log('[DashboardEditor] Raw API Response:', data);

            // Legacy Structure: dashbord1_Line[0].model contains the JSON string
            if (data.dashbord1_Line && data.dashbord1_Line[0]?.model) {
                try {
                    const rawModel = data.dashbord1_Line[0].model;
                    console.log('[DashboardEditor] Found legacy model string:', rawModel);

                    const parsed = JSON.parse(rawModel);
                    console.log('[DashboardEditor] Parsed model:', parsed);

                    if (Array.isArray(parsed)) {
                        // Case 1: Model is directly an array of widgets (Common in legacy)
                        items = parsed;
                    } else if (parsed.dashboard && Array.isArray(parsed.dashboard)) {
                        // Case 2: Model is wrapped in { dashboard: [...] }
                        items = parsed.dashboard;
                    } else {
                        // Fallback: Model might be the widget itself or unknown structure
                        console.warn('[DashboardEditor] Unknown model structure, defaulting to empty array.');
                        items = [];
                    }
                } catch (e) {
                    console.error('[DashboardEditor] Failed to parse legacy dashboard model', e);
                }
            } else if (data.items) {
                // Modern/Direct structure
                items = data.items;
            }

            setDashboard({
                ...data,
                items: items
            });
        } catch (err) {
            console.error('Error loading dashboard:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLayoutChange = (layout: any) => {
        if (!dashboard) return;

        const updatedItems = dashboard.items.map(item => {
            const layoutItem = layout.find((l: any) => l.i === item.id.toString());
            if (layoutItem) {
                return {
                    ...item,
                    x: layoutItem.x,
                    y: layoutItem.y,
                    w: layoutItem.w,
                    h: layoutItem.h
                };
            }
            return item;
        });

        setDashboard({ ...dashboard, items: updatedItems });
    };

    const addWidget = (type: WidgetType) => {
        if (!dashboard) return;

        const newWidget: Widget = {
            id: uuidv4(),
            type,
            name: `New ${type.replace('_', ' ')}`,
            x: (dashboard.items.length * 2) % 12,
            y: Infinity,
            w: 4,
            h: 4,
            config: {}
        };

        setDashboard({
            ...dashboard,
            items: [...dashboard.items, newWidget]
        });
    };

    const handleSave = async () => {
        if (!dashboard) return;
        setSaving(true);
        try {
            const payload = {
                ...dashboard,
                items: dashboard.items
            };

            await dashboardService.saveDashboard(payload);
            alert('Dashboard saved successfully!');
            if (id === 'new') navigate('/dashboards');
        } catch (err) {
            console.error('Save error:', err);
            alert('Failed to save dashboard');
        } finally {
            setSaving(false);
        }
    };

    return {
        dashboard,
        setDashboard,
        loading,
        saving,
        handleLayoutChange,
        addWidget,
        handleSave
    };
};
