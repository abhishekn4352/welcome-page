import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/dashboard.service';
import { Dashboard } from '../types';

export const useDashboardList = () => {
    const [dashboards, setDashboards] = useState<Dashboard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboards();
    }, []);

    const fetchDashboards = async () => {
        try {
            const response: any = await dashboardService.getAllDashboards();

            // API returns a direct array of dashboards
            if (Array.isArray(response)) {
                setDashboards(response);
            } else if (response && response.operationStatus === 'SUCCESS') {
                setDashboards(response.items || []);
            } else {
                // If it's not an array and not a success object, treat as empty or error
                console.warn('Unexpected dashboard response format:', response);
                throw new Error(response?.operationMessage || 'Failed to fetch dashboards');
            }
        } catch (err: any) {
            console.error('Error fetching dashboards:', err);
            setError(err.message || 'Failed to load dashboards');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this dashboard?')) return;

        try {
            const response: any = await dashboardService.deleteDashboard(id);
            if (response.operationStatus === 'SUCCESS') {
                setDashboards(dashboards.filter(d => d.id !== id));
            } else {
                alert('Failed to delete dashboard');
            }
        } catch (err) {
            console.error('Delete error:', err);
            alert('Error deleting dashboard');
        }
    };

    return {
        dashboards,
        loading,
        error,
        navigate,
        handleDelete
    };
};
