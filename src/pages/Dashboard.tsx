import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('fullname') || localStorage.getItem('username') || 'User';

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar Removed - Handled by MainLayout */}

            {/* Main Content */}
            <main className="container mx-auto px-6 py-12">
                <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center max-w-2xl mx-auto">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                        👋
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Welcome to Dashboard, {username}!
                    </h1>
                    <p className="text-gray-500 text-lg mb-8">
                        You have successfully logged in. This is your personal dashboard where you can manage your profile settings.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => navigate('/profile')}
                            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-shadow shadow-md hover:shadow-lg"
                        >
                            Manage Profile
                        </button>
                        <button
                            onClick={() => navigate('/dashboards')}
                            className="px-6 py-3 bg-white text-blue-600 border border-blue-200 font-medium rounded-lg hover:bg-blue-50 transition-colors shadow-sm"
                        >
                            Manage Dashboards
                        </button>
                        <button
                            onClick={() => navigate('/dynamic-forms')}
                            className="px-6 py-3 bg-white text-purple-600 border border-purple-200 font-medium rounded-lg hover:bg-purple-50 transition-colors shadow-sm"
                        >
                            Dynamic Forms
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
