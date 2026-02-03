import React from 'react';
import { FiBarChart2, FiUser, FiUsers, FiKey, FiLock, FiServer, FiShield, FiCloud, FiActivity, FiBox } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const options = [
  { key: 'usage', label: 'Usage and plan', icon: <FiBarChart2 /> },
  { key: 'personal', label: 'Personal', icon: <FiUser /> },
  { key: 'users', label: 'Users', icon: <FiUsers /> },
  { key: 'api', label: 'API', icon: <FiKey /> },
  { key: 'externalSecrets', label: 'External Secrets', icon: <FiLock /> },
  { key: 'environments', label: 'Environments', icon: <FiServer /> },
  { key: 'sso', label: 'SSO', icon: <FiShield /> },
  { key: 'ldap', label: 'LDAP', icon: <FiCloud /> },
  { key: 'logStreaming', label: 'Log Streaming', icon: <FiActivity /> },
  { key: 'communityNodes', label: 'Community nodes', icon: <FiBox /> },
];

interface SidebarProps {
  selected: string;
  setSelected: (selected: string) => void;
}

const Sidebar = ({ selected, setSelected }: SidebarProps) => {
  const navigate = useNavigate();
  
  // Get user data from localStorage
  const fullname = localStorage.getItem('fullname') || 'User';
  const firstName = localStorage.getItem('firstName') || fullname.split(' ')[0] || 'User';
  const email = localStorage.getItem('email') || '';
  
  // Get first letter of the name for avatar
  const avatarLetter = firstName.charAt(0).toUpperCase();
  
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col py-6 px-2 min-h-screen">
      <h2 className="text-xl font-bold mb-6 px-2">Settings</h2>
      <nav className="flex flex-col gap-1">
        {options.map(opt => (
          <button
            key={opt.key}
            className={`flex items-center px-4 py-2 rounded font-medium text-left transition ${selected === opt.key ? 'bg-[#fff1f0] text-[#ff4d4f]' : 'text-gray-700 hover:bg-gray-50'}`}
            onClick={() => setSelected(opt.key)}
          >
            <span className="w-5 h-5 mr-3 flex items-center justify-center">{opt.icon}</span>
            {opt.label}
          </button>
        ))}
      </nav>
      {/* Profile section at the bottom */}
      <div className="mt-auto flex items-center gap-3 px-4 py-4 border-t border-gray-100 cursor-pointer hover:bg-gray-100" onClick={() => navigate('/profile')} title="View Profile">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
          {avatarLetter}
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 font-medium text-sm">{fullname}</span>
          {email && <span className="text-gray-500 text-xs">{email}</span>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 