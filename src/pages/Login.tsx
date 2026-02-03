import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Mail, Lock, User, Check, Loader2 } from 'lucide-react';
import API_BASE_URL from '../config';
import { googleLoginUrl } from '../lib/constants';
import { api } from '../services/api';

const Login = () => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const userId = (typeof window !== 'undefined' && localStorage.getItem('userId')) || '';

  const handleOAuthGoogle = () => {
    console.log('Initiating Google OAuth...');
    window.location.href = googleLoginUrl();
  };

  const handleOAuthGithub = () => {
    console.log('Initiating GitHub OAuth...');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const uid = typeof window !== 'undefined' ? (localStorage.getItem('userId') || '') : '';
    const callback = encodeURIComponent(`${window.location.origin}/auth/callback`);
    const userPart = uid ? `&user_id=${encodeURIComponent(uid)}` : '';
    window.location.href = `${API_BASE_URL}/oauth/github/authorize?redirect_uri=${callback}${userPart}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    console.log(`[Login] Submitting form. Mode: ${activeTab}, Username: ${username}`);

    try {
      if (activeTab === 'signin') {
        // Updated endpoint and payload as per user request
        const data: any = await api.post('/token/session', { email: username, password });
        console.log('[Login] Success response:', data);

        if (data.operationStatus === 'SUCCESS') {
          const user = data.item;

          localStorage.setItem('token', user.token);
          localStorage.setItem('userId', user.userId);
          localStorage.setItem('fullname', user.fullname);
          localStorage.setItem('email', user.email);
          localStorage.setItem('firstName', user.firstName);
          localStorage.setItem('roles', JSON.stringify(user.roles));

          console.log('[Login] Navigating to home...');
          navigate('/home');
        } else {
          throw new Error(data.operationMessage || 'Login failed');
        }
      } else {
        const data: any = await api.post('/signup', { username, email, password });
        console.log('[Signup] Success response:', data);

        // Autofill login fields
        setActiveTab('signin');
        setPassword(password);
        alert('Signup successful! Please login.');
      }
    } catch (err: any) {
      console.error('[Login] Error:', err);
      setError(err.message || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-50">
      {/* Left Panel - Branding & Visuals */}
      <div className="hidden lg:flex w-1/2 bg-zinc-900 border-r border-zinc-800 relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-900/50">
            S
          </div>
          <span className="text-2xl font-bold tracking-tight">SureOps</span>
        </div>

        <div className="z-10 max-w-md mb-20">
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            Streamline your operations with intelligence.
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            The complete platform for managing your IoT infrastructure, workflows, and team collaboration in one secure place.
          </p>
        </div>

        <div className="z-10 text-zinc-500 text-sm">
          &copy; {new Date().getFullYear()} SureOps Inc. All rights reserved.
        </div>

        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 bg-repeat bg-center mix-blend-overlay"></div>
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              {activeTab === 'signin' ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {activeTab === 'signin'
                ? 'Enter your credentials to access your account'
                : 'Enter your details to get started with SureOps'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="bg-gray-100 p-1 rounded-lg flex">
            <button
              onClick={() => setActiveTab('signin')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'signin'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'signup'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {activeTab === 'signup' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="relative group">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="Username"
                    autoComplete="username"
                  />
                </div>
                <div className="relative group">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="Email address"
                    autoComplete="email"
                  />
                </div>
              </div>
            )}

            {activeTab === 'signin' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="relative group">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="Username"
                    autoComplete="username"
                  />
                </div>
              </div>
            )}

            <div className="relative group">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Password"
                autoComplete={activeTab === 'signin' ? 'current-password' : 'new-password'}
              />
            </div>

            {activeTab === 'signin' && (
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${remember ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                    {remember && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    className="hidden"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                  onClick={() => navigate('/reset-password')}
                >
                  Forgot password?
                </button>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20 focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {activeTab === 'signin' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                activeTab === 'signin' ? 'Sign In' : 'Sign Up'
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleOAuthGoogle}
              className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-sm font-medium text-gray-700"
            >
              <FcGoogle className="w-5 h-5" /> Google
            </button>
            <button
              onClick={handleOAuthGithub}
              className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-sm font-medium text-gray-700"
            >
              <FaGithub className="w-5 h-5" /> GitHub
            </button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-6">
            By continuing, you agree to our{' '}
            <Link to="/terms" className="text-gray-900 hover:underline font-medium">Terms</Link> and{' '}
            <Link to="/privacy" className="text-gray-900 hover:underline font-medium">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;