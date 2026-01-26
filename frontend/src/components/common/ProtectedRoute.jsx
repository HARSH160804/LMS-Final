import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role requirement - redirect to home if role doesn't match
    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    // Render children or outlet for nested routes
    return children || <Outlet />;
};

export default ProtectedRoute;
