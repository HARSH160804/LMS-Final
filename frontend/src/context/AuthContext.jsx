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
                // Handle new response format: { ok, status, data }
                if (response.ok && response.data.success) {
                    setUser(response.data.data);
                }
            } catch (error) {
                // Should not happen with non-throwing API, but keep for safety
                console.log('Session check failed (not logged in)');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        const response = await authService.signin({ email, password });
        
        // Handle new response format: { ok, status, data }
        if (response.ok && response.data.success) {
            // Backend returns full user object
            setUser(response.data.user);
            return { success: true };
        }
        
        // Handle error response
        return { 
            success: false, 
            message: response.data.message || 'Login failed' 
        };
    };

    const signup = async (name, email, password, role) => {
        const response = await authService.signup({ name, email, password, role });
        
        // Handle new response format: { ok, status, data }
        if (response.ok && response.data.success) {
            // Backend returns full user object
            setUser(response.data.user);
            return { success: true };
        }
        
        // Handle error response
        return { 
            success: false, 
            message: response.data.message || 'Signup failed' 
        };
    };

    const logout = async () => {
        const response = await authService.signout();
        // Always clear user, even if request fails
        setUser(null);
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
            const response = await authService.getProfile();
            // Handle new response format: { ok, status, data }
            if (response.ok && response.data.success) {
                setUser(response.data.data);
            }
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
