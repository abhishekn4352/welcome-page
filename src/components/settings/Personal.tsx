import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../../config'; // adjust path if needed

const Personal = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
          setUserData(data.item);
        } else {
          console.error(data.detail || 'Failed to fetch user');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchUserData();
    }
  }, []);

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (!userData) return <div className="text-center text-red-500 mt-8">Failed to load user data.</div>;

  return (
    <div className="w-full px-6 py-6 bg-white rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Personal Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Full Name</label>
          <div className="px-3 py-2 border rounded bg-gray-100">{userData.fullname}</div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
          <div className="px-3 py-2 border rounded bg-gray-100">{userData.email}</div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Username</label>
          <div className="px-3 py-2 border rounded bg-gray-100">{userData.username}</div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Role</label>
          <div className="px-3 py-2 border rounded bg-gray-100">{userData.role}</div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-600 mb-2">Notification Settings</label>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={userData.notifications?.email_notifications} readOnly />
              <span>Email Notifications</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={userData.notifications?.system_alerts} readOnly />
              <span>System Alerts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Personal;
