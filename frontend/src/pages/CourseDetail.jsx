import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import courseService from '../services/course.service';
import purchaseService from '../services/purchase.service';
import { useAuth } from '../context/AuthContext';
import PricingCard from '../components/course/PricingCard';
import CurriculumAccordion from '../components/course/CurriculumAccordion';
import InstructorCard from '../components/course/InstructorCard';
import WhatYouLearn from '../components/course/WhatYouLearn';
import CourseRequirements from '../components/course/CourseRequirements';
import CourseHighlights from '../components/course/CourseHighlights';

const CourseDetail = () => {
    const { id } = useParams();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [lectures, setLectures] = useState([]);
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [purchasing, setPurchasing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseRes = await courseService.getCourseDetails(id);
                if (courseRes.success && courseRes.data) {
                    setCourse(courseRes.data);
                    setLectures(courseRes.data.lectures || []);
                } else {
                    setError('Failed to load course details');
                    return;
                }

                if (isAuthenticated) {
                    try {
                        const statusRes = await purchaseService.getPurchaseStatus(id);
                        if (statusRes.success) {
                            if (statusRes.purchased || statusRes.data?.status === 'completed') {
                                setStatus('enrolled');
                            }
                        }
                    } catch (e) {
                        // ignore error
                    }
                }
            } catch (err) {
                setError('An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isAuthenticated]);

    const handlePurchase = async () => {
        // Check authentication first - redirect to login if not authenticated
        if (!isAuthenticated) {
            // Store the current course URL to return after login
            navigate('/login', { state: { from: `/course/${id}` } });
            return;
        }

        setPurchasing(true);
        try {
            if (!course.price || course.price === 0) {
                // Free course enrollment
                const res = await purchaseService.enrollFree(id);
                if (res.success) {
                    setStatus('enrolled');
                    navigate(`/course/${id}/learn`);
                } else {
                    alert(res.message || 'Failed to enroll in course');
                }
            } else {
                // Paid course - create Stripe checkout session
                const res = await purchaseService.createStripeCheckoutSession(id);
                if (res.success && res.url) {
                    window.location.href = res.url;
                } else {
                    alert('Failed to initiate payment. Please try again.');
                }
            }
        } catch (err) {
            console.error('Enrollment error:', err);
            // Only show error if user is authenticated (shouldn't reach here if not authenticated)
            if (isAuthenticated) {
                alert(err.message || 'An error occurred during enrollment. Please try again.');
            }
        } finally {
            setPurchasing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-600">Loading course...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-600 text-lg">{error}</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600 text-lg">Course not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column - Course Info */}
                        <div className="lg:col-span-2">
                            {/* Category Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full text-sm font-medium mb-4 shadow-lg"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                {course.category}
                            </motion.div>

                            {/* Course Title */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight"
                            >
                                {course.title}
                            </motion.h1>

                            {/* Subtitle */}
                            {course.subtitle && (
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="text-xl text-gray-700 mb-6 leading-relaxed"
                                >
                                    {course.subtitle}
                                </motion.p>
                            )}

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="text-lg text-gray-600 mb-8 leading-relaxed"
                            >
                                {course.description}
                            </motion.p>

                            {/* Course Highlights */}
                            <CourseHighlights
                                level={course.level}
                                totalLectures={course.totalLectures}
                                totalDuration={course.totalDuration}
                                enrolledStudents={course.enrolledStudents?.length}
                            />

                            {/* Social Proof */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="mt-6 flex items-center gap-6 text-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="font-semibold text-gray-900">4.8</span>
                                    <span className="text-gray-500">(1,234 ratings)</span>
                                </div>
                                <div className="text-gray-500">
                                    {course.enrolledStudents?.length || 0} students enrolled
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Column - Pricing Card (Desktop) */}
                        <div className="hidden lg:block">
                            <PricingCard
                                course={course}
                                status={status}
                                onEnroll={handlePurchase}
                                purchasing={purchasing}
                                courseId={id}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Course Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* What You'll Learn */}
                        <WhatYouLearn description={course.description} />

                        {/* Instructor */}
                        <InstructorCard instructor={course.instructor} />

                        {/* Course Curriculum */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Curriculum</h2>
                            {lectures.length === 0 ? (
                                <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
                                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-gray-500">No lectures uploaded yet.</p>
                                </div>
                            ) : (
                                <CurriculumAccordion lectures={lectures} />
                            )}
                        </motion.div>

                        {/* Requirements & Target Audience */}
                        <CourseRequirements />
                    </div>

                    {/* Right Column - Sticky Pricing Card (Desktop) */}
                    <div className="hidden lg:block">
                        {/* Spacer for sticky positioning */}
                    </div>
                </div>
            </div>

            {/* Mobile Pricing Card - Fixed Bottom */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl z-50">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <div className="text-2xl font-bold text-gray-900">
                            {course.price === 0 ? 'Free' : `₹${course.price?.toLocaleString()}`}
                        </div>
                        <div className="text-xs text-gray-500">One-time payment</div>
                    </div>
                    {status === 'enrolled' ? (
                        <button
                            onClick={() => navigate(`/course/${id}/learn`)}
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg"
                        >
                            Continue Learning
                        </button>
                    ) : (
                        <button
                            onClick={handlePurchase}
                            disabled={purchasing}
                            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg disabled:opacity-50"
                        >
                            {purchasing ? 'Processing...' : 'Enroll Now'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
