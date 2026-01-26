import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import courseService from '../services/course.service';

const Home = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await courseService.getPublishedCourses();
                if (response.success) {
                    setCourses(response.data || []);
                } else {
                    setError('Failed to load courses');
                }
            } catch (err) {
                setError('Error loading courses');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Skeleton loader for course cards
    const SkeletonCard = () => (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
        }}>
            <div style={{ height: '180px', backgroundColor: '#e2e8f0', animation: 'pulse 2s infinite' }} />
            <div style={{ padding: '1.5rem' }}>
                <div style={{ height: '14px', width: '80px', backgroundColor: '#e2e8f0', borderRadius: '20px', marginBottom: '12px' }} />
                <div style={{ height: '20px', width: '80%', backgroundColor: '#e2e8f0', borderRadius: '4px', marginBottom: '8px' }} />
                <div style={{ height: '14px', width: '100%', backgroundColor: '#e2e8f0', borderRadius: '4px', marginBottom: '6px' }} />
                <div style={{ height: '14px', width: '60%', backgroundColor: '#e2e8f0', borderRadius: '4px', marginBottom: '24px' }} />
                <div style={{ height: '44px', backgroundColor: '#e2e8f0', borderRadius: '24px' }} />
            </div>
        </div>
    );

    // Course Card Component
    const CourseCard = ({ course, index }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -5, boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)' }}
            style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Thumbnail */}
            <div style={{ height: '180px', backgroundColor: '#e2e8f0', position: 'relative', overflow: 'hidden' }}>
                {course.thumbnail ? (
                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        fontSize: '0.875rem'
                    }}>
                        No Thumbnail
                    </div>
                )}

                {/* Price Badge */}
                <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: 'white',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontWeight: '700',
                    fontSize: '0.875rem',
                    color: '#1f2937',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    ₹{course.price}
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Category Pill */}
                <div style={{
                    display: 'inline-block',
                    width: 'fit-content',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    color: '#7c3aed',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '12px'
                }}>
                    {course.category || 'Course'}
                </div>

                {/* Title */}
                <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '700',
                    marginBottom: '8px',
                    lineHeight: '1.4',
                    color: '#1f2937'
                }}>
                    {course.title}
                </h3>

                {/* Description */}
                <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: '1.5',
                    marginBottom: '1.25rem'
                }}>
                    {course.description || 'No description available'}
                </p>

                {/* Footer */}
                <div style={{ marginTop: 'auto' }}>
                    {/* Instructor */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                        }}>
                            {course.instructor?.name?.charAt(0) || 'I'}
                        </div>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            {course.instructor?.name || 'Instructor'}
                        </span>
                    </div>

                    {/* Enroll Button */}
                    <Link
                        to={`/course/${course._id}`}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            width: '100%',
                            padding: '12px 24px',
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                            color: 'white',
                            borderRadius: '24px',
                            fontWeight: '600',
                            fontSize: '0.875rem',
                            textDecoration: 'none',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.03)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
                        }}
                    >
                        Enroll Now
                        <span style={{ fontSize: '1rem' }}>↗</span>
                    </Link>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                    background: 'linear-gradient(135deg, #6b21a8 0%, #7c3aed 50%, #a78bfa 100%)',
                    borderRadius: '24px',
                    padding: '4rem 2rem',
                    margin: '0 auto 3rem',
                    maxWidth: '1200px',
                    textAlign: 'center',
                    boxShadow: '0 20px 60px rgba(124, 58, 237, 0.25)'
                }}
            >
                <h1 style={{
                    fontSize: '2.75rem',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    color: 'white',
                    letterSpacing: '-0.02em'
                }}>
                    Expand Your Knowledge
                </h1>
                <p style={{
                    fontSize: '1.125rem',
                    maxWidth: '550px',
                    margin: '0 auto',
                    color: 'rgba(255, 255, 255, 0.85)',
                    lineHeight: '1.6'
                }}>
                    Choose from our library of expert-led courses and start learning today.
                </p>
            </motion.section>

            {/* Error State */}
            {error && (
                <div style={{
                    textAlign: 'center',
                    color: '#ef4444',
                    marginBottom: '2rem',
                    padding: '1rem',
                    backgroundColor: '#fef2f2',
                    borderRadius: '12px',
                    maxWidth: '1200px',
                    margin: '0 auto 2rem'
                }}>
                    {error}
                </div>
            )}

            {/* Main Content */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
                {/* Section Title */}
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    style={{
                        fontSize: '1.75rem',
                        fontWeight: '700',
                        marginBottom: '2rem',
                        color: '#1f2937'
                    }}
                >
                    Featured Courses
                </motion.h2>

                {/* Loading State */}
                {loading ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '2rem'
                    }}>
                        {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
                    </div>
                ) : courses.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem 2rem',
                        color: '#6b7280',
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
                        <p style={{ fontSize: '1.125rem' }}>No courses are currently available. Check back soon!</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '2rem',
                        paddingBottom: '4rem'
                    }}>
                        {courses.map((course, index) => (
                            <CourseCard key={course._id} course={course} index={index} />
                        ))}
                    </div>
                )}
            </div>

            {/* Skeleton Animation Keyframes */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
};

export default Home;
