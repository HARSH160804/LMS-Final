import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import courseService from '../../services/course.service';

// Icons
const PlayIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
);

const UploadIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const VideoIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
        <line x1="7" y1="2" x2="7" y2="22" />
        <line x1="17" y1="2" x2="17" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <line x1="2" y1="7" x2="7" y2="7" />
        <line x1="2" y1="17" x2="7" y2="17" />
        <line x1="17" y1="17" x2="22" y2="17" />
        <line x1="17" y1="7" x2="22" y2="7" />
    </svg>
);

const GripIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="5" r="1" />
        <circle cx="9" cy="12" r="1" />
        <circle cx="9" cy="19" r="1" />
        <circle cx="15" cy="5" r="1" />
        <circle cx="15" cy="12" r="1" />
        <circle cx="15" cy="19" r="1" />
    </svg>
);

const ClockIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const Spinner = () => (
    <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}
    />
);

// Status Badge
const StatusBadge = ({ isPublished }) => (
    <span style={{
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '0.7rem',
        fontWeight: '700',
        background: isPublished
            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        color: 'white',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    }}>
        {isPublished ? 'Published' : 'Draft'}
    </span>
);

const ManageLectures = () => {
    const { courseId } = useParams();
    const fileInputRef = useRef(null);
    const [course, setCourse] = useState(null);
    const [lectures, setLectures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const [newLecture, setNewLecture] = useState({
        title: '',
        isPreview: false,
        video: null
    });

    const inputStyle = {
        width: '100%',
        padding: '12px 14px',
        fontSize: '0.9375rem',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        backgroundColor: 'white',
        transition: 'all 0.2s ease',
        outline: 'none'
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseResponse = await courseService.getCourseDetails(courseId);
                if (courseResponse.success && courseResponse.data) {
                    setCourse(courseResponse.data);
                } else {
                    setError('Course not found');
                    return;
                }

                try {
                    const lecturesResponse = await courseService.getCourseLectures(courseId);
                    if (lecturesResponse.success && lecturesResponse.data) {
                        setLectures(lecturesResponse.data.lectures || []);
                    }
                } catch (e) {
                    setLectures([]);
                }
            } catch (err) {
                setError('Failed to load course');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId]);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('video/')) {
            setNewLecture(prev => ({ ...prev, video: file }));
            setSelectedFile(file);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewLecture(prev => ({ ...prev, video: file }));
            setSelectedFile(file);
        }
    };

    const clearForm = () => {
        setNewLecture({ title: '', isPreview: false, video: null });
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleAddLecture = async (e) => {
        e.preventDefault();
        if (!newLecture.title || !newLecture.video) {
            setError('Please provide a title and video file');
            return;
        }

        setError(null);
        setSuccess(null);
        setUploading(true);
        setUploadProgress(0);

        // Simulate progress
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 500);

        try {
            const data = new FormData();
            data.append('title', newLecture.title);
            data.append('isPreview', newLecture.isPreview);
            data.append('video', newLecture.video);

            const response = await courseService.addLecture(courseId, data);
            clearInterval(progressInterval);
            setUploadProgress(100);

            if (response.success) {
                setLectures(prev => [...prev, response.data]);
                clearForm();
                setSuccess('Lecture added successfully!');
                setTimeout(() => setSuccess(null), 3000);
            } else {
                setError(response.message || 'Failed to add lecture');
            }
        } catch (err) {
            clearInterval(progressInterval);
            setError(err.message || 'Upload failed');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const formatDuration = (seconds) => {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '';
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(1)} MB`;
    };

    const totalDuration = lectures.reduce((acc, l) => acc + (l.duration || 0), 0);

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <Spinner />
            </div>
        );
    }

    if (!course) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#dc2626' }}>
                Course not found
            </div>
        );
    }

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
                style={{ marginBottom: '24px' }}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                                {course.title}
                            </h1>
                            <StatusBadge isPublished={course.isPublished} />
                        </div>
                        <div style={{ display: 'flex', gap: '16px', color: '#64748b', fontSize: '0.875rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <VideoIcon /> {lectures.length} lectures
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <ClockIcon /> {formatDuration(totalDuration)} total
                            </span>
                        </div>
                    </div>
                    <Link
                        to={`/instructor/course/${courseId}`}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: 'white',
                            color: '#64748b',
                            border: '1px solid #e2e8f0',
                            borderRadius: '10px',
                            fontWeight: '600',
                            fontSize: '0.875rem',
                            textDecoration: 'none',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        ← Back to Course
                    </Link>
                </div>
            </motion.header>

            {/* Messages */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                            padding: '14px 18px',
                            backgroundColor: '#fef2f2',
                            color: '#dc2626',
                            borderRadius: '12px',
                            marginBottom: '20px',
                            border: '1px solid #fecaca'
                        }}
                    >
                        {error}
                    </motion.div>
                )}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                            padding: '14px 18px',
                            backgroundColor: '#ecfdf5',
                            color: '#059669',
                            borderRadius: '12px',
                            marginBottom: '20px',
                            border: '1px solid #a7f3d0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <CheckCircleIcon /> {success}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Two-Pane Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>
                {/* Left Panel - Lecture List */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
                        minHeight: '400px'
                    }}
                >
                    <h2 style={{
                        fontSize: '1rem',
                        fontWeight: '700',
                        color: '#0f172a',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <PlayIcon /> Course Content
                        <span style={{
                            marginLeft: 'auto',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#64748b'
                        }}>
                            {lectures.length} {lectures.length === 1 ? 'lecture' : 'lectures'}
                        </span>
                    </h2>

                    {lectures.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '12px',
                            border: '2px dashed #e2e8f0'
                        }}>
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 20px',
                                    color: 'white'
                                }}
                            >
                                <VideoIcon />
                            </motion.div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
                                Your course has no lectures yet
                            </h3>
                            <p style={{ color: '#64748b', marginBottom: '20px' }}>
                                Start by adding an introduction lecture using the form on the right.
                            </p>
                            <button
                                onClick={() => document.getElementById('lectureTitle')?.focus()}
                                style={{
                                    padding: '10px 20px',
                                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem'
                                }}
                            >
                                Add your first lecture →
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {lectures.map((lecture, index) => (
                                <motion.div
                                    key={lecture._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.01, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}
                                    style={{
                                        padding: '16px',
                                        backgroundColor: '#f8fafc',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '14px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        border: '1px solid transparent'
                                    }}
                                >
                                    <div style={{ color: '#94a3b8', cursor: 'grab' }}>
                                        <GripIcon />
                                    </div>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '10px',
                                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: '700',
                                        fontSize: '0.875rem',
                                        flexShrink: 0
                                    }}>
                                        {index + 1}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontWeight: '600',
                                            color: '#0f172a',
                                            marginBottom: '4px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {lecture.title}
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            fontSize: '0.8rem',
                                            color: '#64748b'
                                        }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <ClockIcon /> {formatDuration(lecture.duration)}
                                            </span>
                                            <span style={{
                                                padding: '2px 8px',
                                                backgroundColor: '#dcfce7',
                                                color: '#16a34a',
                                                borderRadius: '4px',
                                                fontSize: '0.7rem',
                                                fontWeight: '600'
                                            }}>
                                                Uploaded
                                            </span>
                                        </div>
                                    </div>
                                    {lecture.isPreview && (
                                        <span style={{
                                            padding: '4px 10px',
                                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                            color: 'white',
                                            borderRadius: '6px',
                                            fontSize: '0.7rem',
                                            fontWeight: '700',
                                            textTransform: 'uppercase'
                                        }}>
                                            Preview
                                        </span>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Right Panel - Add Lecture Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
                        position: 'sticky',
                        top: '90px'
                    }}
                >
                    <h3 style={{
                        fontSize: '1rem',
                        fontWeight: '700',
                        color: '#0f172a',
                        marginBottom: '20px'
                    }}>
                        {uploading ? 'Uploading Lecture...' : 'Add New Lecture'}
                    </h3>

                    <form onSubmit={handleAddLecture}>
                        {/* Title */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: '#374151'
                            }}>
                                Lecture Title <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                id="lectureTitle"
                                type="text"
                                value={newLecture.title}
                                onChange={(e) => setNewLecture(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="e.g., Introduction to React"
                                style={inputStyle}
                                disabled={uploading}
                                onFocus={(e) => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)'; }}
                                onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>

                        {/* Video Upload */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: '#374151'
                            }}>
                                Video File <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <div
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => !uploading && fileInputRef.current?.click()}
                                style={{
                                    border: `2px dashed ${isDragging ? '#8b5cf6' : selectedFile ? '#10b981' : '#e2e8f0'}`,
                                    borderRadius: '12px',
                                    padding: '32px 20px',
                                    textAlign: 'center',
                                    cursor: uploading ? 'not-allowed' : 'pointer',
                                    backgroundColor: isDragging ? 'rgba(139, 92, 246, 0.05)' : selectedFile ? 'rgba(16, 185, 129, 0.05)' : '#fafafa',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {uploading ? (
                                    <div>
                                        <div style={{ marginBottom: '12px' }}>
                                            <Spinner />
                                        </div>
                                        <p style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                                            Uploading video...
                                        </p>
                                        <div style={{
                                            width: '100%',
                                            height: '6px',
                                            backgroundColor: '#e2e8f0',
                                            borderRadius: '10px',
                                            overflow: 'hidden',
                                            marginTop: '12px'
                                        }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${uploadProgress}%` }}
                                                style={{
                                                    height: '100%',
                                                    background: 'linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%)',
                                                    borderRadius: '10px'
                                                }}
                                            />
                                        </div>
                                        <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '8px' }}>
                                            {uploadProgress}% complete
                                        </p>
                                    </div>
                                ) : selectedFile ? (
                                    <div>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 12px',
                                            color: 'white'
                                        }}>
                                            <CheckCircleIcon />
                                        </div>
                                        <p style={{ fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>
                                            {selectedFile.name}
                                        </p>
                                        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                            {formatFileSize(selectedFile.size)} • Click to change
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ color: '#94a3b8', marginBottom: '12px' }}>
                                            <UploadIcon />
                                        </div>
                                        <p style={{ fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                                            Drop your video here, or <span style={{ color: '#8b5cf6' }}>browse</span>
                                        </p>
                                        <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                            MP4, MOV, WebM up to 500MB
                                        </p>
                                    </>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="video/*"
                                onChange={handleFileSelect}
                                style={{ display: 'none' }}
                            />
                        </div>

                        {/* Free Preview Toggle */}
                        <div style={{
                            marginBottom: '24px',
                            padding: '16px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '12px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>
                                        Free Preview
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                        Preview lectures are visible to all users
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setNewLecture(prev => ({ ...prev, isPreview: !prev.isPreview }))}
                                    disabled={uploading}
                                    style={{
                                        width: '48px',
                                        height: '28px',
                                        borderRadius: '14px',
                                        border: 'none',
                                        backgroundColor: newLecture.isPreview ? '#8b5cf6' : '#e2e8f0',
                                        cursor: uploading ? 'not-allowed' : 'pointer',
                                        position: 'relative',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <motion.div
                                        animate={{ x: newLecture.isPreview ? 20 : 0 }}
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            backgroundColor: 'white',
                                            position: 'absolute',
                                            top: '2px',
                                            left: '2px',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <motion.button
                                type="submit"
                                disabled={uploading || !newLecture.title || !newLecture.video}
                                whileHover={{ scale: (!uploading && newLecture.title && newLecture.video) ? 1.02 : 1 }}
                                whileTap={{ scale: (!uploading && newLecture.title && newLecture.video) ? 0.98 : 1 }}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    padding: '14px 20px',
                                    background: (uploading || !newLecture.title || !newLecture.video)
                                        ? '#e2e8f0'
                                        : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                    color: (uploading || !newLecture.title || !newLecture.video) ? '#94a3b8' : 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: '600',
                                    fontSize: '0.9375rem',
                                    cursor: (uploading || !newLecture.title || !newLecture.video) ? 'not-allowed' : 'pointer',
                                    boxShadow: (uploading || !newLecture.title || !newLecture.video) ? 'none' : '0 4px 16px rgba(139, 92, 246, 0.3)',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {uploading ? <><Spinner /> Uploading...</> : 'Add Lecture'}
                            </motion.button>
                            {!uploading && (newLecture.title || selectedFile) && (
                                <button
                                    type="button"
                                    onClick={clearForm}
                                    style={{
                                        padding: '14px 20px',
                                        backgroundColor: 'white',
                                        color: '#64748b',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '12px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </form>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ManageLectures;
