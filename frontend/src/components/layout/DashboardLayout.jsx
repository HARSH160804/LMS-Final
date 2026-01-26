import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

// Icon components for sidebar navigation
const ProfileIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const CoursesIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
);

const MyLearningIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
);

const DashboardIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
    </svg>
);

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/profile', label: 'Profile', icon: ProfileIcon },
        { path: '/', label: 'Browse Courses', icon: CoursesIcon },
        { path: '/my-courses', label: 'My Courses', icon: MyLearningIcon },
    ];

    const getPageTitle = () => {
        if (location.pathname === '/profile') return { breadcrumb: 'Account', title: 'My Profile', subtitle: 'Manage your account settings' };
        if (location.pathname === '/my-courses') return { breadcrumb: 'Learning', title: 'My Courses', subtitle: 'Track your enrolled courses' };
        if (location.pathname === '/instructor') return { breadcrumb: 'Dashboard', title: 'Overview', subtitle: 'Manage your courses and content' };
        if (location.pathname === '/instructor/create') return { breadcrumb: 'Dashboard / Overview', title: 'Create Course', subtitle: 'Create a new course' };
        if (location.pathname.startsWith('/instructor/course/') && location.pathname.endsWith('/lectures')) return { breadcrumb: 'Dashboard / Course', title: 'Manage Lectures', subtitle: 'Add and organize your lectures' };
        if (location.pathname.startsWith('/instructor/course/')) return { breadcrumb: 'Dashboard / Overview', title: 'Manage Course', subtitle: 'Edit course details' };
        return { breadcrumb: 'Dashboard', title: 'Overview', subtitle: '' };
    };

    const pageInfo = getPageTitle();

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
                color: 'white',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                boxShadow: '4px 0 24px rgba(0, 0, 0, 0.1)'
            }}>
                {/* Logo */}
                <div style={{ padding: '1.75rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        letterSpacing: '-0.025em',
                        background: 'linear-gradient(135deg, #a78bfa 0%, #818cf8 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        LMS Platform
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{ padding: '1.5rem 0.75rem', flex: 1 }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);
                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '12px 16px',
                                            borderRadius: '10px',
                                            color: active ? 'white' : '#94a3b8',
                                            backgroundColor: active ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                                            fontWeight: 500,
                                            fontSize: '0.9rem',
                                            textDecoration: 'none',
                                            transition: 'all 0.2s ease',
                                            position: 'relative',
                                            borderLeft: active ? '3px solid #8b5cf6' : '3px solid transparent',
                                            marginLeft: active ? '-3px' : '0',
                                            boxShadow: active ? '0 0 20px rgba(139, 92, 246, 0.15)' : 'none'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!active) {
                                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                                                e.currentTarget.style.color = 'white';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!active) {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                e.currentTarget.style.color = '#94a3b8';
                                            }
                                        }}
                                    >
                                        <Icon />
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}

                        {user?.role === 'instructor' && (
                            <>
                                <div style={{
                                    marginTop: '24px',
                                    marginBottom: '8px',
                                    paddingLeft: '16px',
                                    fontSize: '0.7rem',
                                    textTransform: 'uppercase',
                                    color: '#64748b',
                                    fontWeight: '600',
                                    letterSpacing: '0.05em'
                                }}>
                                    Instructor
                                </div>
                                <li>
                                    <Link
                                        to="/instructor"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '12px 16px',
                                            borderRadius: '10px',
                                            color: isActive('/instructor') ? 'white' : '#94a3b8',
                                            backgroundColor: isActive('/instructor') ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                                            fontWeight: 500,
                                            fontSize: '0.9rem',
                                            textDecoration: 'none',
                                            transition: 'all 0.2s ease',
                                            borderLeft: isActive('/instructor') ? '3px solid #8b5cf6' : '3px solid transparent',
                                            marginLeft: isActive('/instructor') ? '-3px' : '0'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActive('/instructor')) {
                                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                                                e.currentTarget.style.color = 'white';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActive('/instructor')) {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                e.currentTarget.style.color = '#94a3b8';
                                            }
                                        }}
                                    >
                                        <DashboardIcon />
                                        Dashboard
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>

                {/* User Card */}
                <motion.div
                    style={{
                        padding: '1.25rem',
                        borderTop: '1px solid rgba(255,255,255,0.08)',
                        margin: '0.5rem',
                        marginTop: 0,
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.03)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '1rem',
                            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                        }}>
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <div style={{
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: 'white',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {user?.name}
                            </div>
                            <div style={{
                                fontSize: '0.75rem',
                                color: '#8b5cf6',
                                textTransform: 'capitalize'
                            }}>
                                {user?.role || 'Student'}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </aside>

            {/* Main Content Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '260px' }}>
                {/* Topbar */}
                <header style={{
                    height: '70px',
                    backgroundColor: 'white',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 2rem',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '2px' }}>
                            {pageInfo.breadcrumb} / <span style={{ color: '#1e293b' }}>{pageInfo.title}</span>
                        </div>
                        <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#0f172a' }}>
                            {pageInfo.title}
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: 'transparent',
                            color: '#64748b',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            fontWeight: '500',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#cbd5e1';
                            e.currentTarget.style.backgroundColor = '#f8fafc';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        Sign out
                    </button>
                </header>

                {/* Content Outlet */}
                <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', backgroundColor: '#f8fafc' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
