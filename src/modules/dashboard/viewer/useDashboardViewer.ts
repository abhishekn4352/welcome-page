import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { dashboardService } from '../services/dashboard.service';


export const useDashboardViewer = () => {
    const { id } = useParams();
    const [layouts, setLayouts] = useState<any[]>([]);
    const [dashboardName, setDashboardName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<any[]>([]);

    useEffect(() => {
        const loadDashboard = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const data = await dashboardService.getDashboardById(Number(id));
                const item = data.dashbord1_Line?.[0];

                if (item?.model) {
                    setDashboardName(data.dashboard_name || 'Untitled Dashboard');
                    try {
                        const parsed = JSON.parse(item.model);
                        // The legacy model structure usually has { dashboard: [...] }
                        const items = parsed.dashboard || (Array.isArray(parsed) ? parsed : []);
                        setLayouts(items);
                        // Extract filters if available
                        if (parsed.filters && Array.isArray(parsed.filters)) {
                            setFilters(parsed.filters);
                        }
                    } catch (e) {
                        console.error('JSON Parse Error', e);
                        setError('Invalid dashboard data');
                    }
                } else {
                    setError('Dashboard content not found');
                }
            } catch (err: any) {
                console.error(err);
                setError('Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, [id]);

    return { layouts, dashboardName, loading, error, filters };
};
