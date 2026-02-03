import React from 'react';
import { Loader2, Plus, Edit, Trash2, Layout } from 'lucide-react';
import { useDashboardList } from './useDashboardList';

const DashboardList = () => {
    const { dashboards, loading, error, navigate, handleDelete } = useDashboardList();

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboards</h1>
                    <p className="text-sm text-gray-500">Manage your analytics dashboards.</p>
                </div>
                <button
                    onClick={() => navigate('/dashboards/new')}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4" />
                    New Dashboard
                </button>
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {dashboards.map((dashboard) => (
                    <div
                        key={dashboard.id}
                        className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                    >
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <Layout className="h-6 w-6" />
                        </div>
                        <div
                            className="cursor-pointer"
                            onClick={() => navigate(`/dashboards/${dashboard.id}`)}
                        >
                            <h3 className="mb-2 text-lg font-semibold text-gray-900 hover:text-blue-600">
                                {dashboard.dashboard_name || dashboard.name || 'Untitled Dashboard'}
                            </h3>
                            <p className="mb-4 text-sm text-gray-500 line-clamp-2">
                                {dashboard.dashboard_description || dashboard.description || 'No description available.'}
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/dashboards/edit/${dashboard.id}`);
                                }}
                                className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                                title="Edit"
                            >
                                <Edit className="h-4 w-4" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(dashboard.id);
                                }}
                                className="rounded p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                                title="Delete"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {dashboards.length === 0 && !error && (
                    <div className="col-span-full flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-center">
                        <Layout className="mb-2 h-10 w-10 text-gray-400" />
                        <h3 className="text-lg font-medium text-gray-900">No dashboards yet</h3>
                        <p className="text-gray-500">Create your first dashboard to get started.</p>
                        <button
                            onClick={() => navigate('/dashboards/new')}
                            className="mt-4 text-sm font-medium text-blue-600 hover:underline"
                        >
                            Create one now &rarr;
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardList;
