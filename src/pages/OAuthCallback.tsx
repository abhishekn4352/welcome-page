import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API_BASE_URL from '../config';
import { jwtDecode } from 'jwt-decode';

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('Finalizing sign-in...');

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get('token');
    const userId = url.searchParams.get('userId');
    const fullname = url.searchParams.get('fullname');
    const email = url.searchParams.get('email');

    // Case A: Backend redirected with token in query params (JWT flow).
    // Do not require userId; we can fetch it using the token.
    if (token) {
      try { console.log('[OAuthCallback] Received token (masked):', token.slice(0, 12) + '...'); } catch { }
      localStorage.setItem('token', token);
      if (userId) localStorage.setItem('userId', userId);
      if (fullname) localStorage.setItem('fullname', fullname);
      if (email) localStorage.setItem('email', email);

      // Try to enrich profile using the token; proceed regardless of result.
      (async () => {
        try {
          // First, try to decode JWT for immediate UI values
          try {
            const decoded: any = jwtDecode(token);
            console.log('[OAuthCallback] Decoded JWT claims:', decoded);
            if (!userId && (decoded?.user_id || decoded?.sub)) localStorage.setItem('userId', String(decoded.user_id ?? decoded.sub));
            if (!fullname && (decoded?.name || decoded?.fullname || decoded?.username)) localStorage.setItem('fullname', decoded.name || decoded.fullname || decoded.username);
            if (!email && decoded?.email) localStorage.setItem('email', decoded.email);
            if (decoded?.given_name || decoded?.username) localStorage.setItem('firstName', decoded.given_name || decoded.username);
            if (decoded?.roles) {
              localStorage.setItem('roles', JSON.stringify(decoded.roles));
            } else if (decoded?.role) {
              localStorage.setItem('roles', JSON.stringify([decoded.role]));
            }
            console.log('[OAuthCallback] Stored from JWT →', {
              userId: localStorage.getItem('userId'),
              fullname: localStorage.getItem('fullname'),
              email: localStorage.getItem('email'),
              firstName: localStorage.getItem('firstName'),
              roles: localStorage.getItem('roles')
            });
          } catch { }

          const res = await fetch(`${API_BASE_URL}/auth/me`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            credentials: 'omit'
          });
          if (res.ok) {
            const me = await res.json();
            try { console.log('[OAuthCallback] /auth/me (Bearer) response:', me); } catch { }
            const uid = me?.userId ?? me?.id ?? me?.sub ?? me?.user_id;
            const name = me?.fullname ?? me?.name ?? me?.fullName ?? me?.displayName ?? me?.username;
            const first = me?.firstName ?? me?.given_name ?? me?.first_name ?? '';
            const mail = me?.email ?? me?.primaryEmail ?? me?.mail ?? me?.user_email ?? (Array.isArray(me?.emails) ? me.emails[0]?.value : undefined);
            const roles = me?.roles ?? (me?.role ? [me.role] : undefined);
            if (uid) localStorage.setItem('userId', String(uid));
            if (name) localStorage.setItem('fullname', name);
            if (mail) localStorage.setItem('email', mail);
            if (first) localStorage.setItem('firstName', first);
            if (roles) localStorage.setItem('roles', JSON.stringify(roles));
            console.log('[OAuthCallback] Stored from /auth/me →', {
              userId: localStorage.getItem('userId'),
              fullname: localStorage.getItem('fullname'),
              email: localStorage.getItem('email'),
              firstName: localStorage.getItem('firstName'),
              roles: localStorage.getItem('roles')
            });
          }
        } catch { }
        navigate('/home');
      })();
      return;
    }

    // Case B: Backend set HttpOnly cookie session; fetch current user
    const checkSession = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          const me = await res.json();
          try { console.log('[OAuthCallback] /auth/me (cookie) response:', me); } catch { }
          const uid = me?.userId ?? me?.id ?? me?.sub ?? me?.user_id;
          const name = me?.fullname ?? me?.name ?? me?.fullName ?? me?.displayName ?? me?.username;
          const first = me?.firstName ?? me?.given_name ?? me?.first_name ?? '';
          const mail = me?.email ?? me?.primaryEmail ?? me?.mail ?? me?.user_email ?? (Array.isArray(me?.emails) ? me.emails[0]?.value : undefined);
          const roles = me?.roles ?? (me?.role ? [me.role] : undefined);
          if (uid) localStorage.setItem('userId', String(uid));
          if (name) localStorage.setItem('fullname', name);
          if (first) localStorage.setItem('firstName', first);
          if (mail) localStorage.setItem('email', mail);
          if (roles) localStorage.setItem('roles', JSON.stringify(roles));
          // Mark logged-in (used by some parts of the UI)
          if (!localStorage.getItem('token')) {
            localStorage.setItem('token', 'cookie');
          }
          console.log('[OAuthCallback] Stored from cookie session →', {
            userId: localStorage.getItem('userId'),
            fullname: localStorage.getItem('fullname'),
            email: localStorage.getItem('email'),
            firstName: localStorage.getItem('firstName'),
            roles: localStorage.getItem('roles')
          });
          navigate('/home');
        } else {
          setMessage('Could not verify session. Please try signing in again.');
          setTimeout(() => navigate('/login'), 1200);
        }
      } catch (e) {
        setMessage('Network error while finalizing sign-in.');
        setTimeout(() => navigate('/login'), 1200);
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
        <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold mb-2 mx-auto">S</div>
        <div className="font-semibold text-lg text-gray-900 mb-2">SureOps</div>
        <div className="text-sm text-gray-600">{message}</div>
      </div>
    </div>
  );
};

export default OAuthCallback;
