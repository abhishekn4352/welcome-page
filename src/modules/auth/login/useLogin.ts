import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from './auth.service';

// Demo user for when API is unavailable
const DEMO_USER = {
    token: 'demo-token-12345',
    userId: 1,
    fullname: 'Demo User',
    email: 'demo@sureops.com',
    firstName: 'Demo',
    roles: ['admin', 'user']
};

export const useLogin = () => {
    const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [remember, setRemember] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleOAuth = (provider: 'google' | 'github') => {
        console.log(`Initiating ${provider} OAuth...`);
        // Implementation for OAuth would go here
    };

    const loginWithDemoUser = () => {
        localStorage.setItem('token', DEMO_USER.token);
        localStorage.setItem('userId', DEMO_USER.userId.toString());
        localStorage.setItem('fullname', DEMO_USER.fullname);
        localStorage.setItem('email', DEMO_USER.email);
        localStorage.setItem('firstName', DEMO_USER.firstName);
        localStorage.setItem('roles', JSON.stringify(DEMO_USER.roles));
        localStorage.setItem('demoMode', 'true');
        navigate('/home');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (activeTab === 'signin') {
                const data = await authService.login(username, password);

                if (data.operationStatus === 'SUCCESS') {
                    const user = data.item;
                    localStorage.setItem('token', user.token);
                    localStorage.setItem('userId', user.userId.toString());
                    localStorage.setItem('fullname', user.fullname);
                    localStorage.setItem('email', user.email);
                    localStorage.setItem('firstName', user.firstName);
                    localStorage.setItem('roles', JSON.stringify(user.roles));
                    localStorage.removeItem('demoMode');

                    navigate('/home');
                } else {
                    throw new Error(data.operationMessage || 'Login failed');
                }
            } else {
                const data = await authService.signup(username, email, password);
                if (data.operationStatus === 'SUCCESS') {
                    setActiveTab('signin');
                    alert('Signup successful! Please login.');
                } else {
                    throw new Error(data.operationMessage || 'Signup failed');
                }
            }
        } catch (err: any) {
            console.error('Auth Error:', err);
            
            // Handle API unavailable - offer demo mode
            if (err.message === 'API_UNAVAILABLE') {
                setError('Server is unreachable. You can try Demo Mode to explore the app.');
            } else {
                setError(err.message || 'Operation failed');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        activeTab,
        setActiveTab,
        username,
        setUsername,
        email,
        setEmail,
        password,
        setPassword,
        error,
        remember,
        setRemember,
        isLoading,
        handleSubmit,
        handleOAuth,
        loginWithDemoUser
    };
};
