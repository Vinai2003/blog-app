import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../utils/api';
import { jwtDecode } from 'jwt-decode';

interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    register: (userData: any) => Promise<void>;
    login: (credentials: any) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Check for token on initial load
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Verify token validity
                const decoded: any = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decoded.exp < currentTime) {
                    // Token expired
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    setLoading(false);
                    return;
                }

                // Get user data
                const response = await authAPI.getProfile();
                setUser(response.data);
                setIsAuthenticated(true);
            } catch (err) {
                console.error('Auth verification error:', err);
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Register a new user
    // Update the register function
    const register = async (userData: any) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authAPI.register(userData);
            console.log('Registration successful:', response.data);

            // After registration, login with new credentials
            await login({
                username: userData.username,
                password: userData.password
            });
        } catch (err: any) {
            console.error('Registration error details:', err.response?.data);

            // Handle validation errors more specifically
            if (err.response && err.response.data) {
                const errorData = err.response.data;
                let errorMessage = 'Registration failed: ';

                // Process validation errors from Django REST framework
                if (typeof errorData === 'object') {
                    const errorMessages = [];
                    for (const key in errorData) {
                        if (Array.isArray(errorData[key])) {
                            errorMessages.push(`${key}: ${errorData[key].join(', ')}`);
                        } else {
                            errorMessages.push(`${key}: ${errorData[key]}`);
                        }
                    }
                    errorMessage += errorMessages.join('; ');
                } else {
                    errorMessage += errorData;
                }

                setError(errorMessage);
                throw new Error(errorMessage);
            } else {
                const errorMessage = 'Registration failed. Please try again.';
                setError(errorMessage);
                throw new Error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    // Login user
    const login = async (credentials: any) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authAPI.login(credentials);
            const { access, refresh } = response.data;

            // Save tokens
            localStorage.setItem('token', access);
            localStorage.setItem('refreshToken', refresh);

            // Decode user data from token
            const decoded: any = jwtDecode(access);

            // Get user profile
            const profileResponse = await authAPI.getProfile();
            setUser(profileResponse.data);
            setIsAuthenticated(true);
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || 'Login failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Logout user
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
