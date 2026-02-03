import React from 'react';
import DashboardList from '../../modules/dashboard/list/DashboardList';
import { Link } from 'react-router-dom';

const List = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/home" className="text-xl font-bold text-gray-900">SureOps</Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-sm font-medium text-gray-600">Dashboards</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/profile" className="text-sm font-medium text-gray-600 hover:text-gray-900">Profile</Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <DashboardList />
            </main>
        </div>
    );
};

export default List;
