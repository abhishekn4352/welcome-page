import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !username || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await api.put('/reset-password', {
        email,
        username,
        new_password: newPassword,
      });

      setSuccess('Password reset successful! You can now login.');
      setEmail('');
      setUsername('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 flex flex-col items-center">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold mb-2">
            S
          </div>
          <div className="font-semibold text-lg text-gray-900">sureops</div>
        </div>
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label className="block text-gray-700 mb-1 text-sm">Email Address</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              placeholder="Enter your email address"
              autoComplete="email"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1 text-sm">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1 text-sm">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              placeholder="Enter new password"
              autoComplete="new-password"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1 text-sm">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              placeholder="Confirm new password"
              autoComplete="new-password"
            />
          </div>

          {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
          {success && <div className="text-green-600 text-sm mb-3">{success}</div>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors mb-4 text-sm"
          >
            Reset Password
          </button>

          <button
            type="button"
            onClick={() => navigate('/home')}
            className="w-full bg-gray-300 text-gray-800 py-2 rounded font-semibold hover:bg-gray-400 transition-colors text-sm"
          >
            Home
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
