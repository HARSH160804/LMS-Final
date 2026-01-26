import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check valid session on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await authService.getProfile();
                if (response.success) {
                    setUser(response.data);
                }
            } catch (error) {
                // 401 or network error - assume not logged in
                console.log('Session check failed (not logged in)');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authService.signin({ email, password });
            if (response.success) {
                // Backend now returns full user object with role
                setUser(response.user);
                return { success: true };
            }
            return { success: false, message: response.message };
        } catch (error) {
            return { success: false, message: error.message || 'Login failed' };
        }
    };

    const signup = async (name, email, password, role) => {
        try {
            const response = await authService.signup({ name, email, password, role });
            if (response.success) {
                // Backend now returns full user object with role
                setUser(response.user);
                return { success: true };
            }
            return { success: false, message: response.message };
        } catch (error) {
            return { success: false, message: error.message || 'Signup failed' };
        }
    };

    const logout = async () => {
        try {
            await authService.signout();
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        isInstructor: user?.role === 'instructor',
        isAdmin: user?.role === 'admin',
        login,
        signup,
        logout,
        refreshProfile: async () => {
            try {
                const res = await authService.getProfile();
                if (res.success) setUser(res.data);
            } catch (e) { /* ignore */ }
        }
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
