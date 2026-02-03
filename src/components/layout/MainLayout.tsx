import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const MainLayout = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('fullname') || localStorage.getItem('username') || 'User';

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Persistent Header */}
            <nav className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => navigate('/home')}
                >
                    <div className="bg-blue-600 text-white rounded-lg w-8 h-8 flex items-center justify-center font-bold">S</div>
                    <span className="text-xl font-bold text-gray-800">SureOps</span>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/profile')}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        Profile
                    </button>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Dynamic Content */}
            <main className="flex-1 w-full">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
