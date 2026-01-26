import { motion } from 'framer-motion';

const InstructorCard = ({ instructor }) => {
    if (!instructor) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100"
        >
            <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    {instructor.avatar && instructor.avatar !== 'default-avatar.png' ? (
                        <img
                            src={instructor.avatar}
                            alt={instructor.name}
                            className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-lg"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white shadow-lg">
                            {instructor.name?.charAt(0).toUpperCase() || 'I'}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-gray-900">{instructor.name}</h3>
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Expert Instructor</p>
                    
                    {instructor.bio && (
                        <p className="text-sm text-gray-700 leading-relaxed mb-4">
                            {instructor.bio}
                        </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span>1,000+ students</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span>5 courses</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default InstructorCard;
