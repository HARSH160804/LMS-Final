import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import purchaseService from '../services/purchase.service';
import { useAuth } from '../context/AuthContext';

// Icons
const BookIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const ClockIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const PlayIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
);

const SparklesIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l1.45 4.55L18 9l-4.55 1.45L12 15l-1.45-4.55L6 9l4.55-1.45L12 3z" />
        <path d="M5 19l.9 2.1L8 22l-2.1.9L5 25l-.9-2.1L2 22l2.1-.9L5 19z" />
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

// Course Card Component
const CourseCard = ({ purchase, index }) => {
    const course = purchase.courseId;
    if (!course) return null;

    // Mock progress data (in real app, this would come from API)
    const progress = Math.floor(Math.random() * 80) + 10;
    const totalModules = course.modules?.length || 10;
    const currentModule = Math.ceil((progress / 100) * totalModules);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)' }}
            style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.3s ease'
            }}
        >
            {/* Thumbnail */}
            <div style={{
                height: '160px',
                backgroundColor: '#e2e8f0',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {course.thumbnail ? (
                    <motion.img
                        src={course.thumbnail}
                        alt={course.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    />
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

                {/* Status Badge */}
                <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: purchase.status === 'completed'
                        ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}>
                    {purchase.status === 'completed' ? 'Paid' : 'Free'}
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: '20px' }}>
                {/* Title */}
                <h3 style={{
                    fontSize: '1.0625rem',
                    fontWeight: '700',
                    marginBottom: '16px',
                    lineHeight: '1.4',
                    color: '#0f172a',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {course.title}
                </h3>

                {/* Progress */}
                <div style={{ marginBottom: '16px' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                    }}>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            Module {currentModule} of {totalModules}
                        </span>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#8b5cf6' }}>
                            {progress}%
                        </span>
                    </div>
                    <div style={{
                        width: '100%',
                        height: '6px',
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

                {/* Meta Info */}
                <div style={{
                    display: 'flex',
                    gap: '16px',
                    marginBottom: '20px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid #f1f5f9'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748b' }}>
                        <BookIcon />
                        {totalModules} lessons
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748b' }}>
                        <ClockIcon />
                        {Math.floor(Math.random() * 10) + 2}h
                    </div>
                </div>

                {/* CTA Button */}
                <Link
                    to={`/course/${course._id}/learn`}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        width: '100%',
                        padding: '12px 20px',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        color: 'white',
                        borderRadius: '12px',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
                    }}
                >
                    <PlayIcon />
                    Resume Learning
                </Link>
            </div>
        </motion.div>
    );
};

// Skeleton Card for loading state
const SkeletonCard = () => (
    <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
    }}>
        <div style={{ height: '160px', backgroundColor: '#e2e8f0', animation: 'pulse 2s infinite' }} />
        <div style={{ padding: '20px' }}>
            <div style={{ height: '20px', width: '80%', backgroundColor: '#e2e8f0', borderRadius: '4px', marginBottom: '16px' }} />
            <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '10px', marginBottom: '16px' }} />
            <div style={{ height: '44px', backgroundColor: '#e2e8f0', borderRadius: '12px' }} />
        </div>
    </div>
);

const MyCourses = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const response = await purchaseService.getMyPurchasedCourses();
                if (response.success) {
                    // Filter out purchases where the course was deleted
                    const validCourses = response.data.filter(p => p.courseId !== null);
                    setCourses(validCourses);
                } else {
                    setError(response.message || 'Failed to fetch courses');
                }
            } catch (err) {
                setError('An error occurred while loading your courses');
            } finally {
                setLoading(false);
            }
        };

        fetchPurchases();
    }, []);

    // Calculate stats
    const totalCourses = courses.length;
    const completedCourses = courses.filter(c => c.progress === 100).length || 0;
    const learningHours = totalCourses * 5; // Mock data

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                    padding: '3rem',
                    textAlign: 'center',
                    backgroundColor: '#fef2f2',
                    borderRadius: '16px',
                    color: '#dc2626'
                }}
            >
                <p style={{ marginBottom: '1rem' }}>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: 'white',
                        color: '#dc2626',
                        border: '1px solid #fecaca',
                        borderRadius: '10px',
                        fontWeight: '500',
                        cursor: 'pointer'
                    }}
                >
                    Try Again
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            {/* Header Section */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{ marginBottom: '32px' }}
            >
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#0f172a',
                    marginBottom: '8px'
                }}>
                    My Learning
                </h1>
                <p style={{ fontSize: '1.0625rem', color: '#64748b' }}>
                    Welcome back, <span style={{ fontWeight: '600', color: '#0f172a' }}>{user?.name}</span>
                </p>
                <p style={{ fontSize: '0.9375rem', color: '#94a3b8', marginTop: '4px' }}>
                    Continue where you left off.
                </p>
            </motion.header>

            {/* Stats Overview */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '40px'
            }}>
                <StatCard
                    icon={BookIcon}
                    label="Courses Enrolled"
                    value={totalCourses}
                    color="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
                    delay={0.1}
                />
                <StatCard
                    icon={CheckCircleIcon}
                    label="Courses Completed"
                    value={completedCourses}
                    color="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                    delay={0.2}
                />
                <StatCard
                    icon={ClockIcon}
                    label="Learning Hours"
                    value={`${learningHours}h`}
                    color="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                    delay={0.3}
                />
            </div>

            {/* Loading State */}
            {loading ? (
                <>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '20px' }}>
                        Continue Learning
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '24px'
                    }}>
                        {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                    </div>
                </>
            ) : courses.length === 0 ? (
                /* Empty State */
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
                        <SparklesIcon />
                    </motion.div>
                    <h3 style={{ fontSize: '1.375rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>
                        Start your learning journey
                    </h3>
                    <p style={{
                        maxWidth: '400px',
                        margin: '0 auto 28px',
                        color: '#64748b',
                        lineHeight: '1.6'
                    }}>
                        You haven't enrolled in any courses yet. Browse our catalog to find your next skill.
                    </p>
                    <Link
                        to="/"
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
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.03)';
                            e.currentTarget.style.boxShadow = '0 6px 24px rgba(139, 92, 246, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(139, 92, 246, 0.3)';
                        }}
                    >
                        Browse Courses
                    </Link>
                </motion.div>
            ) : (
                /* Course Grid */
                <>
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
                        Continue Learning
                    </motion.h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '24px'
                    }}>
                        {courses.map((purchase, index) => (
                            <CourseCard key={purchase._id} purchase={purchase} index={index} />
                        ))}
                    </div>
                </>
            )}

            {/* Pulse Animation Keyframes */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </motion.div>
    );
};

export default MyCourses;
