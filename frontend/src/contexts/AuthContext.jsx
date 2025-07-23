import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in from localStorage
        const checkAuth = () => {
            try {
                const userData = localStorage.getItem('user');
                if (userData) {
                    const user = JSON.parse(userData);
                    setUser(user);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:3001/login', {
                email,
                password
            });
            
            if (response.data.status === "Success") {
                const user = {
                    _id: response.data.id,
                    name: response.data.name || 'Student',
                    email: response.data.email || email,
                    role: 'student'
                };
                
                // Store user data in localStorage for persistence
                localStorage.setItem('user', JSON.stringify(user));
                setUser(user);
                return { success: true };
            } else {
                return { 
                    success: false, 
                    message: response.data.status || 'Login failed' 
                };
            }
        } catch (error) {
            console.error('Login failed:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Login failed' 
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        // Redirect to login page
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {!loading && children}
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

export default AuthContext;
