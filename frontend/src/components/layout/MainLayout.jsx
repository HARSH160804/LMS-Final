import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MainLayout = () => {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <div className="layout-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header style={{
                padding: '1rem 2rem',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'white',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <Link to="/" style={{ fontSize: '1.25rem', fontWeight: '700', color: '#7c3aed', textDecoration: 'none' }}>
                    LMS Platform
                </Link>
                <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Link to="/" style={{ color: 'var(--color-text-secondary)', fontWeight: '500' }}>Courses</Link>

                    {isAuthenticated ? (
                        <>
                            <Link to="/my-courses" style={{ color: 'var(--color-text-secondary)', fontWeight: '500' }}>My Learning</Link>
                            {user?.role === 'instructor' && (
                                <Link to="/instructor" style={{ color: 'var(--color-text-secondary)', fontWeight: '500' }}>Instructor</Link>
                            )}
                            <Link to="/profile" style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--color-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: '600',
                                fontSize: '0.875rem'
                            }}>
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                style={{
                                    padding: '8px 20px',
                                    borderRadius: '24px',
                                    border: '1px solid #e5e7eb',
                                    color: '#374151',
                                    fontWeight: '500',
                                    fontSize: '0.875rem',
                                    backgroundColor: 'white',
                                    transition: 'all 0.2s ease',
                                    textDecoration: 'none'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f9fafb';
                                    e.currentTarget.style.borderColor = '#d1d5db';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'white';
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                }}
                            >
                                Log In
                            </Link>
                            <Link
                                to="/signup"
                                style={{
                                    padding: '8px 20px',
                                    borderRadius: '24px',
                                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                    color: 'white',
                                    fontWeight: '600',
                                    fontSize: '0.875rem',
                                    boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
                                    transition: 'all 0.2s ease',
                                    textDecoration: 'none'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.03)';
                                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(139, 92, 246, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(139, 92, 246, 0.3)';
                                }}
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </nav>
            </header>

            <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%', flex: 1 }}>
                <Outlet />
            </main>

            <footer style={{
                padding: '2rem',
                borderTop: '1px solid var(--color-border)',
                textAlign: 'center',
                backgroundColor: 'var(--color-bg-secondary)',
                color: 'var(--color-text-secondary)'
            }}>
                <p>© 2024 LMS Platform. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default MainLayout;
