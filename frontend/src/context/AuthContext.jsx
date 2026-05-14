import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    const fetchUser = useCallback(async (t) => {
        if (!t) {
            setLoading(false);
            return;
        }

        try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
            const res = await axios.get(`${API_BASE_URL}/auth/me`);
            setUser(res.data.data);
        } catch (err) {
            console.error('Session verification failed:', err);
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            delete axios.defaults.headers.common['Authorization'];
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (token && !user) {
            fetchUser(token);
        } else if (!token) {
            setLoading(false);
        }
    }, [token, user, fetchUser]);

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
            const userToken = res.data.token;
            // Ensure userData is an object with a role property
            const userData = res.data.user || { role: res.data.role };

            localStorage.setItem('token', userToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
            
            // setUser MUST be an object, not a raw string
            setUser(userData);
            setToken(userToken);
            
            return { ...res.data, user: userData };
        } catch (err) {
            throw err;
        }
    };

    const register = async (userDataInput) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/auth/register`, userDataInput);
            const userToken = res.data.token;
            // Ensure userProfile is an object
            const userProfile = res.data.user || { role: res.data.role };

            localStorage.setItem('token', userToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
            
            // setUser MUST be an object
            setUser(userProfile);
            setToken(userToken);
            
            return { ...res.data, user: userProfile };
        } catch (err) {
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
        setLoading(false);
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
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
