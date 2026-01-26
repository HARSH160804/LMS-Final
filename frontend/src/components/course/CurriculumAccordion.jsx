import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CurriculumAccordion = ({ lectures }) => {
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [showAll, setShowAll] = useState(false);

    const displayedLectures = showAll ? lectures : lectures.slice(0, 5);
    const hasMore = lectures.length > 5;

    const toggleLecture = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const formatDuration = (seconds) => {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-2">
            {displayedLectures.map((lecture, index) => (
                <motion.div
                    key={lecture._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:border-indigo-200 transition-colors duration-200"
                >
                    <button
                        onClick={() => toggleLecture(index)}
                        className="w-full px-6 py-4 flex items-center gap-4 bg-white hover:bg-gray-50 transition-colors duration-200"
                    >
                        {/* Lecture Number */}
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                            <span className="text-sm font-semibold text-indigo-600">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                        </div>

                        {/* Lecture Title */}
                        <div className="flex-1 text-left">
                            <h4 className="font-medium text-gray-900">{lecture.title}</h4>
                        </div>

                        {/* Duration & Preview Badge */}
                        <div className="flex items-center gap-3">
                            {lecture.duration > 0 && (
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {formatDuration(lecture.duration)}
                                </span>
                            )}
                            
                            {lecture.isPreview && (
                                <span className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                    Preview
                                </span>
                            )}

                            {/* Expand Icon */}
                            <motion.svg
                                animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </motion.svg>
                        </div>
                    </button>

                    {/* Expanded Content */}
                    <AnimatePresence>
                        {expandedIndex === index && lecture.description && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {lecture.description}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}

            {/* Show More Button */}
            {hasMore && !showAll && (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAll(true)}
                    className="w-full mt-4 py-3 px-6 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors duration-200 font-medium"
                >
                    Show {lectures.length - 5} more lectures
                </motion.button>
            )}

            {showAll && hasMore && (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAll(false)}
                    className="w-full mt-4 py-3 px-6 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors duration-200 font-medium"
                >
                    Show less
                </motion.button>
            )}
        </div>
    );
};

export default CurriculumAccordion;
