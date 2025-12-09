import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import api from '../services/api';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    settings?: {
        currency: string;
        dateFormat: string;
        pnlType: 'absolute' | 'percentage';
    };
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('lastActivity');
        setToken(null);
        setUser(null);
    }, []);

    // Session timeout effect
    useEffect(() => {
        if (!token) return;

        const checkSession = () => {
            const lastActivity = localStorage.getItem('lastActivity');
            if (lastActivity) {
                const timeSinceActivity = Date.now() - parseInt(lastActivity, 10);
                if (timeSinceActivity > SESSION_TIMEOUT) {
                    logout();
                    alert('Session expired due to inactivity. Please log in again.');
                }
            }
        };

        const updateActivity = () => {
            localStorage.setItem('lastActivity', Date.now().toString());
        };

        // Initialize last activity
        updateActivity();

        // Activity listeners
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        events.forEach(event => window.addEventListener(event, updateActivity));

        // Check session every minute
        const interval = setInterval(checkSession, 60 * 1000);

        return () => {
            events.forEach(event => window.removeEventListener(event, updateActivity));
            clearInterval(interval);
        };
    }, [token, logout]);

    useEffect(() => {
        if (token) {
            // Ideally, verify token with backend here or decode it
            // For now, we assume if token exists, we might be logged in
            // In a real app, we'd fetch user profile here
        }
    }, [token]);

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('lastActivity', Date.now().toString());
        setToken(newToken);
        setUser(newUser);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
