import { motion } from 'framer-motion';

const WhatYouLearn = ({ description }) => {
    // Generate learning points from description or use defaults
    const learningPoints = [
        'Master the fundamentals and advanced concepts',
        'Build real-world projects from scratch',
        'Learn industry best practices and patterns',
        'Get hands-on experience with practical exercises',
        'Understand core principles and methodologies',
        'Develop problem-solving and critical thinking skills',
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100"
        >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What you'll learn</h2>
            <div className="grid md:grid-cols-2 gap-4">
                {learningPoints.map((point, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                        className="flex items-start gap-3"
                    >
                        <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 leading-relaxed">{point}</span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default WhatYouLearn;
