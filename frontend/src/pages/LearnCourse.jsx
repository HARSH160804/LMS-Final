import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import courseService from '../services/course.service';
import progressService from '../services/progress.service';

const LearnCourse = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [lectures, setLectures] = useState([]);
    const [currentLecture, setCurrentLecture] = useState(null);
    const [progress, setProgress] = useState(null);
    const [completionPercentage, setCompletionPercentage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseRes = await courseService.getCourseDetails(id);
                if (courseRes.success && courseRes.data) {
                    setCourse(courseRes.data);
                } else {
                    setError('Failed to load course');
                    return;
                }

                try {
                    const lecturesRes = await courseService.getCourseLectures(id);
                    if (lecturesRes.success && lecturesRes.data) {
                        const lecturesList = lecturesRes.data.lectures || [];
                        setLectures(lecturesList);
                        if (lecturesList.length > 0) {
                            setCurrentLecture(lecturesList[0]);
                        }
                    }
                } catch (e) {
                    console.error('Error fetching lectures:', e);
                }

                try {
                    const progressRes = await progressService.getCourseProgress(id);
                    console.log('🔍 Frontend received progress:', {
                        progress: progressRes.data?.progress,
                        completionPercentage: progressRes.data?.completionPercentage,
                        progressLength: progressRes.data?.progress?.length
                    });
                    if (progressRes.success && progressRes.data) {
                        setProgress(progressRes.data.progress || []);
                        setCompletionPercentage(progressRes.data.completionPercentage || 0);
                    }
                } catch (e) {
                    // Progress might not exist yet
                    setProgress([]);
                    setCompletionPercentage(0);
                }
            } catch (err) {
                console.error('Error loading course:', err);
                setError('An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleLectureComplete = async (lectureId) => {
        try {
            const res = await progressService.updateLectureProgress(id, lectureId);
            
            if (res.success && res.data) {
                // Update progress state with new data from backend
                setProgress(res.data.lectureProgress || []);
                
                // Use backend's calculated percentage (accurate based on total course lectures)
                setCompletionPercentage(res.data.completionPercentage || 0);
            }
        } catch (err) {
            console.error('Failed to update progress:', err);
        }
    };

    const isLectureCompleted = (lectureId) => {
        if (!progress || !Array.isArray(progress)) {
            return false;
        }
        
        const completed = progress.some(lp => {
            // Handle both ObjectId string and object with _id
            const progressLectureId = typeof lp.lecture === 'object' ? lp.lecture._id : lp.lecture;
            // Convert both to strings for comparison
            const match = String(progressLectureId) === String(lectureId) && lp.isCompleted;
            return match;
        });
        
        return completed;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading course...</p>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error || 'Course not found'}</p>
                    <Link to="/my-courses" className="inline-block px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                        Back to My Courses
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="grid lg:grid-cols-[1fr_380px] gap-0 h-screen">
                {/* Main Content Area */}
                <div className="flex flex-col bg-gray-50 p-6 overflow-auto">
                    {currentLecture ? (
                        <>
                            {/* Video Player Card */}
                            <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-4">
                                <div className="bg-black aspect-video flex items-center justify-center">
                                    {currentLecture.videoUrl ? (
                                        <video
                                            key={currentLecture._id}
                                            controls
                                            autoPlay
                                            className="w-full h-full"
                                            onEnded={() => handleLectureComplete(currentLecture._id)}
                                        >
                                            <source src={currentLecture.videoUrl} type="video/mp4" />
                                            Your browser does not support video playback.
                                        </video>
                                    ) : (
                                        <div className="text-white text-center">
                                            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                            <p>Video not available</p>
                                        </div>
                                    )}
                                </div>

                                {/* Action Bar */}
                                <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-100">
                                    <div className="flex-1">
                                        <h2 className="text-lg font-semibold text-gray-900">{currentLecture.title}</h2>
                                        {currentLecture.description && (
                                            <p className="text-sm text-gray-600 mt-1">{currentLecture.description}</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleLectureComplete(currentLecture._id)}
                                        className={`ml-4 px-6 py-2.5 rounded-lg font-medium transition-colors ${
                                            isLectureCompleted(currentLecture._id)
                                                ? 'bg-green-500 text-white hover:bg-green-600'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        }`}
                                    >
                                        {isLectureCompleted(currentLecture._id) ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                Completed
                                            </span>
                                        ) : (
                                            'Mark as Complete'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-500">No lecture selected</p>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="bg-white border-l border-gray-200 overflow-auto">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100">
                        <Link to="/my-courses" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to My Courses
                        </Link>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">{course.title}</h3>
                        
                        {/* Progress Bar */}
                        <div>
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                <span className="font-medium">Your Progress</span>
                                <span className="font-semibold text-indigo-600">{completionPercentage}%</span>
                            </div>
                            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(completionPercentage, 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Lecture List */}
                    <div className="p-4 space-y-2">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-3">
                            Course Content
                        </h4>
                        {lectures.map((lecture, index) => (
                            <button
                                key={lecture._id}
                                onClick={() => setCurrentLecture(lecture)}
                                className={`w-full p-4 rounded-xl text-left transition-all ${
                                    currentLecture?._id === lecture._id
                                        ? 'bg-blue-50 border-2 border-blue-200 shadow-sm'
                                        : 'bg-white border-2 border-gray-100 hover:border-gray-200 hover:shadow-sm'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Status Icon */}
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                        isLectureCompleted(lecture._id)
                                            ? 'bg-green-500 text-white'
                                            : currentLecture?._id === lecture._id
                                            ? 'bg-indigo-100 text-indigo-600 border-2 border-indigo-300'
                                            : 'bg-gray-100 text-gray-600 border-2 border-gray-200'
                                    }`}>
                                        {isLectureCompleted(lecture._id) ? (
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            index + 1
                                        )}
                                    </div>

                                    {/* Lecture Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className={`text-sm font-medium truncate ${
                                            currentLecture?._id === lecture._id ? 'text-indigo-900' : 'text-gray-900'
                                        }`}>
                                            {lecture.title}
                                        </div>
                                        {lecture.duration && (
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {Math.floor(lecture.duration / 60)}:{String(Math.floor(lecture.duration % 60)).padStart(2, '0')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearnCourse;
