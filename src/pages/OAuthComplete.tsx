import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthComplete: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('auth_token', token);
      navigate('/home', { replace: true });
    } else {
      // Fallback when backend didn't redirect (e.g., dev/testing): try fetching JSON
      // Not strictly necessary if you always provide redirect_to
      navigate('/login?error=missing_token', { replace: true });
    }
  }, [navigate]);

  return <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
      <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold mb-2 mx-auto">S</div>
      <div className="font-semibold text-lg text-gray-900 mb-2">SureOps</div>
      <div className="text-sm text-gray-600">Completing sign-in...</div>
    </div>
  </div>;
};

export default OAuthComplete;