import { motion } from 'framer-motion';

const CourseRequirements = () => {
    const requirements = [
        'No prior experience required - we\'ll teach you everything',
        'A computer with internet connection',
        'Willingness to learn and practice',
        'Basic computer skills',
    ];

    const targetAudience = [
        'Beginners who want to start their learning journey',
        'Students looking to enhance their skills',
        'Professionals seeking to upskill',
        'Anyone interested in this topic',
    ];

    return (
        <div className="space-y-8">
            {/* Requirements */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-2xl p-8 border border-gray-100"
            >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Requirements</h2>
                <ul className="space-y-3">
                    {requirements.map((req, index) => (
                        <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                            className="flex items-start gap-3 text-gray-700"
                        >
                            <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>{req}</span>
                        </motion.li>
                    ))}
                </ul>
            </motion.div>

            {/* Who this course is for */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white rounded-2xl p-8 border border-gray-100"
            >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Who this course is for</h2>
                <ul className="space-y-3">
                    {targetAudience.map((audience, index) => (
                        <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                            className="flex items-start gap-3 text-gray-700"
                        >
                            <svg className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <span>{audience}</span>
                        </motion.li>
                    ))}
                </ul>
            </motion.div>
        </div>
    );
};

export default CourseRequirements;
