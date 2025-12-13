import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const GoogleCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const handleCallback = async () => {
            const token = searchParams.get('token');
            if (token) {
                try {
                    // Set token for the subsequent request
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                    // Fetch full user profile to get settings/role
                    const res = await api.get('/auth/profile');

                    // Complete login
                    login(token, res.data);
                    navigate('/dashboard');
                } catch (error) {
                    console.error('Google Auth Success but Profile Fetch Failed:', error);
                    navigate('/login');
                }
            } else {
                navigate('/login');
            }
        };

        handleCallback();
    }, [searchParams, navigate, login]);

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-slate-400">Completing login...</p>
            </div>
        </div>
    );
};

export default GoogleCallback;
