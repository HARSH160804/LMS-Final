import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import courseService from '../../services/course.service';
import { useAuth } from '../../context/AuthContext';

// Icons
const BookIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
);

const UsersIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const DollarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
);

const FileIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
    </svg>
);

const PlusIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const PlayIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
);

const SettingsIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);

const AlertIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        style={{
            backgroundColor: 'white',
            borderRadius: '14px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
            border: '1px solid #f1f5f9'
        }}
    >
        <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
        }}>
            <Icon />
        </div>
        <div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a', lineHeight: 1 }}>
                {value}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>
                {label}
            </div>
        </div>
    </motion.div>
);

// Status Badge Component
const StatusBadge = ({ status }) => {
    const configs = {
        published: { bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', text: 'Published' },
        draft: { bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', text: 'Draft' },
        review: { bg: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', text: 'In Review' }
    };
    const config = status ? configs.published : configs.draft;

    return (
        <span style={{
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.7rem',
            fontWeight: '700',
            background: config.bg,
            color: 'white',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
        }}>
            {config.text}
        </span>
    );
};

// Course Card Component
const CourseCard = ({ course, index }) => {
    const totalLectures = course.modules?.reduce((acc, m) => acc + (m.lectures?.length || 0), 0) || 0;
    const expectedLectures = 24; // Mock expected count
    const progress = Math.min((totalLectures / expectedLectures) * 100, 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)' }}
            style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                gap: '24px',
                alignItems: 'flex-start',
                boxShadow: '0 2px 16px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.2s ease',
                border: '1px solid #f1f5f9'
            }}
        >
            {/* Thumbnail */}
            <div style={{
                width: '160px',
                height: '100px',
                borderRadius: '12px',
                backgroundColor: '#e2e8f0',
                overflow: 'hidden',
                flexShrink: 0
            }}>
                {course.thumbnail ? (
                    <img src={course.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white'
                    }}>
                        <BookIcon />
                    </div>
                )}
            </div>

            {/* Course Details */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: '700',
                        margin: 0,
                        color: '#0f172a',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        {course.title}
                    </h3>
                    <StatusBadge status={course.isPublished} />
                </div>

                {/* Meta Info */}
                <div style={{ display: 'flex', gap: '20px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.875rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <PlayIcon /> {totalLectures} lectures
                    </span>
                    <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                        ₹{course.price}
                    </span>
                </div>

                {/* Progress */}
                <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            Lectures added: {totalLectures} / {expectedLectures}
                        </span>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#8b5cf6' }}>
                            {Math.round(progress)}%
                        </span>
                    </div>
                    <div style={{
                        width: '100%',
                        height: '4px',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '10px',
                        overflow: 'hidden'
                    }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                            style={{
                                height: '100%',
                                background: 'linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%)',
                                borderRadius: '10px'
                            }}
                        />
                    </div>
                </div>

                {/* Warning if no lectures */}
                {totalLectures === 0 && (
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        backgroundColor: '#fef3c7',
                        color: '#92400e',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                    }}>
                        <AlertIcon />
                        Add your first lecture
                    </div>
                )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                <Link
                    to={`/instructor/course/${course._id}`}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '10px 18px',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        color: 'white',
                        borderRadius: '10px',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        textDecoration: 'none',
                        boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(139, 92, 246, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(139, 92, 246, 0.3)';
                    }}
                >
                    <SettingsIcon />
                    Manage
                </Link>
                <Link
                    to={`/instructor/course/${course._id}/lectures`}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '10px 18px',
                        backgroundColor: 'white',
                        color: '#64748b',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        fontWeight: '500',
                        fontSize: '0.875rem',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                        e.currentTarget.style.borderColor = '#cbd5e1';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                >
                    <PlayIcon />
                    Lectures
                </Link>
            </div>
        </motion.div>
    );
};

// Skeleton Card for loading
const SkeletonCard = () => (
    <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        gap: '24px',
        alignItems: 'flex-start',
        boxShadow: '0 2px 16px rgba(0, 0, 0, 0.05)'
    }}>
        <div style={{ width: '160px', height: '100px', backgroundColor: '#e2e8f0', borderRadius: '12px', animation: 'pulse 2s infinite' }} />
        <div style={{ flex: 1 }}>
            <div style={{ height: '20px', width: '60%', backgroundColor: '#e2e8f0', borderRadius: '4px', marginBottom: '12px' }} />
            <div style={{ height: '14px', width: '40%', backgroundColor: '#e2e8f0', borderRadius: '4px', marginBottom: '12px' }} />
            <div style={{ height: '4px', backgroundColor: '#e2e8f0', borderRadius: '10px' }} />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ width: '100px', height: '40px', backgroundColor: '#e2e8f0', borderRadius: '10px' }} />
            <div style={{ width: '100px', height: '40px', backgroundColor: '#e2e8f0', borderRadius: '10px' }} />
        </div>
    </div>
);

const InstructorDashboard = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await courseService.getMyCreatedCourses();
                if (response.success) {
                    setCourses(response.data || []);
                } else {
                    setError('Failed to load courses');
                }
            } catch (err) {
                setError('Error loading your courses');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Calculate stats
    const totalCourses = courses.length;
    const publishedCourses = courses.filter(c => c.isPublished).length;
    const draftCourses = courses.filter(c => !c.isPublished).length;
    const totalStudents = courses.reduce((acc, c) => acc + (c.enrolledCount || 0), 0);
    const totalRevenue = courses.reduce((acc, c) => acc + ((c.enrolledCount || 0) * (c.price || 0)), 0);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '32px',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}
            >
                <div>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: '#0f172a',
                        marginBottom: '8px'
                    }}>
                        Instructor Dashboard
                    </h1>
                    <p style={{ fontSize: '1rem', color: '#64748b' }}>
                        Manage your courses and content
                    </p>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                        to="/instructor/create"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 24px',
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                            color: 'white',
                            borderRadius: '12px',
                            fontWeight: '600',
                            fontSize: '0.9375rem',
                            textDecoration: 'none',
                            boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <PlusIcon />
                        Create New Course
                    </Link>
                </motion.div>
            </motion.header>

            {/* Error State */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                            padding: '16px 20px',
                            backgroundColor: '#fef2f2',
                            color: '#dc2626',
                            borderRadius: '12px',
                            marginBottom: '24px',
                            border: '1px solid #fecaca'
                        }}
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats Overview */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
                marginBottom: '40px'
            }}>
                <StatCard
                    icon={BookIcon}
                    label="Total Courses"
                    value={totalCourses}
                    color="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
                    delay={0.1}
                />
                <StatCard
                    icon={UsersIcon}
                    label="Total Students"
                    value={totalStudents}
                    color="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                    delay={0.2}
                />
                <StatCard
                    icon={DollarIcon}
                    label="Total Revenue"
                    value={`₹${totalRevenue.toLocaleString()}`}
                    color="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                    delay={0.3}
                />
                <StatCard
                    icon={FileIcon}
                    label="Draft Courses"
                    value={draftCourses}
                    color="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                    delay={0.4}
                />
            </div>

            {/* Courses Section */}
            <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: '#0f172a',
                    marginBottom: '20px'
                }}
            >
                Your Courses
            </motion.h2>

            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                </div>
            ) : courses.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    style={{
                        textAlign: 'center',
                        padding: '60px 40px',
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)'
                    }}
                >
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '80px',
                            height: '80px',
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.15) 100%)',
                            borderRadius: '50%',
                            marginBottom: '24px',
                            color: '#8b5cf6'
                        }}
                    >
                        <BookIcon />
                    </motion.div>
                    <h3 style={{ fontSize: '1.375rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>
                        No courses yet
                    </h3>
                    <p style={{
                        maxWidth: '400px',
                        margin: '0 auto 28px',
                        color: '#64748b',
                        lineHeight: '1.6'
                    }}>
                        Start creating your first course and share your knowledge with students around the world.
                    </p>
                    <Link
                        to="/instructor/create"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '14px 28px',
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                            color: 'white',
                            borderRadius: '12px',
                            fontWeight: '600',
                            textDecoration: 'none',
                            boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <PlusIcon />
                        Create Your First Course
                    </Link>
                </motion.div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {courses.map((course, index) => (
                        <CourseCard key={course._id} course={course} index={index} />
                    ))}
                </div>
            )}

            {/* Pulse Animation */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </motion.div>
    );
};

export default InstructorDashboard;
