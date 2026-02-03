import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const ProfilePage = () => {
  const navigate = useNavigate();

  const storedProfile = {
    name: localStorage.getItem('fullname') || localStorage.getItem('username') || 'Unknown',
    email: localStorage.getItem('email') || 'unknown@example.com',
    firstName: localStorage.getItem('firstName') || localStorage.getItem('username') || '',
    role: localStorage.getItem('role') || 'USER',
    userId: localStorage.getItem('userId') || '',
  };

  const [editMode, setEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [profile, setProfile] = useState({
    name: storedProfile.name,
    email: storedProfile.email,
    role: storedProfile.role,
    userId: storedProfile.userId,
  });

  const [editProfile, setEditProfile] = useState(profile);

  // On mount, if values look unknown, try to fetch from backend and hydrate localStorage
  useEffect(() => {
    const looksUnknown = !storedProfile.name || storedProfile.name === 'Unknown' || !storedProfile.email || storedProfile.email === 'unknown@example.com';
    if (!looksUnknown) return;

    const hydrate = async () => {
      try {
        const me: any = await api.get('/auth/me');
        const name = me?.fullname ?? me?.name ?? me?.username ?? '';
        if (name) localStorage.setItem('fullname', name);
        if (me?.firstName) localStorage.setItem('firstName', me.firstName);
        if (me?.email) localStorage.setItem('email', me.email);
        if (me?.userId) localStorage.setItem('userId', String(me.userId));
        if (me?.roles) localStorage.setItem('roles', JSON.stringify(me.roles));
        setProfile({
          name: name || 'Unknown',
          email: me.email || 'unknown@example.com',
          role: me.role || 'USER',
          userId: (me.userId && String(me.userId)) || storedProfile.userId,
        });
      } catch {
        // ignore
      }
    };
    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = () => {
    setEditProfile(profile);
    setEditMode(true);
    setSuccessMessage('');
  };

  const handleSave = async () => {
    try {
      const data: any = await api.put(`/users/${profile.userId}`, {
        fullname: editProfile.name,
        firstName: editProfile.name,
        email: editProfile.email,
        role: editProfile.role,
      });

      // Update localStorage
      localStorage.setItem("fullname", data.item.fullname);
      localStorage.setItem("firstName", data.item.firstName);
      localStorage.setItem("email", data.item.email);
      // Update roles in localStorage if provided in response
      if (data.item.role) {
        localStorage.setItem("role", data.item.role);
      }

      // Update state
      setProfile({
        ...profile,
        name: data.item.fullname,
        email: data.item.email,
        role: data.item.role,
      });

      setEditMode(false);
      setSuccessMessage('Profile updated successfully');
    } catch (err) {
      console.error(err);
      setSuccessMessage('');
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setSuccessMessage('');
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleHome = () => {
    navigate('/home');
  };

  const handleResetPassword = () => {
    navigate('/reset-password');
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-md flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-3xl mb-4">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <div className="text-xl font-semibold text-gray-900 mb-1">{profile.name}</div>
        <div className="text-gray-500 text-sm mb-4">{profile.role}</div>

        <div className="w-full border-t border-gray-200 my-4" />

        {editMode ? (
          <div className="w-full flex flex-col gap-3 mb-6">
            <div className="flex justify-between items-center text-gray-700">
              <span className="font-medium">Name:</span>
              <input
                className="border border-gray-300 rounded px-2 py-1 text-sm w-1/2"
                value={editProfile.name}
                onChange={e => setEditProfile({ ...editProfile, name: e.target.value })}
              />
            </div>
            <div className="flex justify-between items-center text-gray-700">
              <span className="font-medium">Email:</span>
              <input
                className="border border-gray-300 rounded px-2 py-1 text-sm w-1/2"
                value={editProfile.email}
                onChange={e => setEditProfile({ ...editProfile, email: e.target.value })}
              />
            </div>
            <div className="flex justify-between items-center text-gray-700">
              <span className="font-medium">Role:</span>
              <select
                className="border border-gray-300 rounded px-2 py-1 text-sm w-1/2"
                value={editProfile.role}
                onChange={e => setEditProfile({ ...editProfile, role: e.target.value })}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="USER">USER</option>
                <option value="Log Analyst">Log Analyst</option>
                <option value="Workflow Editor">Workflow Editor</option>
                <option value="Execution Approver">Execution Approver</option>
                <option value="Billing Manager">Billing Manager</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-2 mb-6">
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">Name:</span>
              <span>{profile.name}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">Email:</span>
              <span>{profile.email}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">Role:</span>
              <span>{profile.role}</span>
            </div>
          </div>
        )}

        {successMessage && !editMode && (
          <div className="text-green-600 text-sm mb-4">{successMessage}</div>
        )}

        {editMode ? (
          <div className="flex gap-2 w-full">
            <button onClick={handleSave} className="flex-1 px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Save</button>
            <button onClick={handleCancel} className="flex-1 px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition">Cancel</button>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-2">
            <div className="flex gap-2 w-full">
              <button onClick={handleEdit} className="flex-1 px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Edit Profile</button>
              <button onClick={handleResetPassword} className="flex-1 px-4 py-2 rounded bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition">Reset Password</button>
            </div>
            {/* Logout and Home removed as they are in the MainLayout header */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;