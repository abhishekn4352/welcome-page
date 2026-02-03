import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from './auth.service';

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
        // For now just logging as placeholder
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (activeTab === 'signin') {
                // For signin, we use value from 'username' state which maps to email input
                const data = await authService.login(username, password);

                if (data.operationStatus === 'SUCCESS') {
                    const user = data.item;
                    localStorage.setItem('token', user.token);
                    localStorage.setItem('userId', user.userId.toString());
                    localStorage.setItem('fullname', user.fullname);
                    localStorage.setItem('email', user.email);
                    localStorage.setItem('firstName', user.firstName);
                    localStorage.setItem('roles', JSON.stringify(user.roles));

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
            setError(err.message || 'Operation failed');
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
        handleOAuth
    };
};
