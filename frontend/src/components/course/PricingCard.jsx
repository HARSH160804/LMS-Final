import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PricingCard = ({ course, status, onEnroll, purchasing, courseId }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="sticky top-24 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
            {/* Course Thumbnail */}
            <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden group">
                {course.thumbnail ? (
                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>

            <div className="p-6">
                {/* Price */}
                <div className="mb-6">
                    {course.price === 0 ? (
                        <div>
                            <div className="text-4xl font-bold text-gray-900 mb-1">Free</div>
                            <div className="text-sm text-green-600 font-medium">Limited time offer</div>
                        </div>
                    ) : (
                        <div>
                            <div className="text-4xl font-bold text-gray-900">₹{course.price?.toLocaleString()}</div>
                            <div className="text-sm text-gray-500 mt-1">One-time payment</div>
                        </div>
                    )}
                </div>

                {/* CTA Button */}
                {status === 'enrolled' ? (
                    <Link to={`/course/${courseId}/learn`}>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Continue Learning
                        </motion.button>
                    </Link>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onEnroll}
                        disabled={purchasing}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {purchasing ? (
                            <>
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                                Start Learning Now
                            </>
                        )}
                    </motion.button>
                )}

                {/* Trust Signals */}
                <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Lifetime access</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>30-day money-back guarantee</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Beginner friendly</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Certificate of completion</span>
                    </div>
                </div>

                {/* Secondary CTA */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <button className="w-full text-gray-600 hover:text-gray-900 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Share this course
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default PricingCard;
