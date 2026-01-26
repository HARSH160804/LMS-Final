import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import courseService from '../../services/course.service';

// Icons
const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const UploadIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const PlayIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
);

const AlertIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

const SaveIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
    </svg>
);

const Spinner = () => (
    <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}
    />
);

// Status Badge
const StatusBadge = ({ isPublished }) => (
    <span style={{
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '700',
        background: isPublished
            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        color: 'white',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
    }}>
        {isPublished ? 'Published' : 'Draft'}
    </span>
);

// Level Selector Pills
const LevelSelector = ({ value, onChange }) => {
    const levels = ['beginner', 'intermediate', 'advanced'];
    return (
        <div style={{ display: 'flex', gap: '8px' }}>
            {levels.map(level => (
                <button
                    key={level}
                    type="button"
                    onClick={() => onChange(level)}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '24px',
                        border: value === level ? 'none' : '1px solid #e2e8f0',
                        background: value === level ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : 'white',
                        color: value === level ? 'white' : '#64748b',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        transition: 'all 0.2s ease',
                        boxShadow: value === level ? '0 4px 12px rgba(139, 92, 246, 0.3)' : 'none'
                    }}
                >
                    {level}
                </button>
            ))}
        </div>
    );
};

// Form Input Component
const FormInput = ({ label, required, helper, children }) => (
    <div style={{ marginBottom: '24px' }}>
        <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#374151'
        }}>
            {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
        {children}
        {helper && (
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '6px' }}>{helper}</p>
        )}
    </div>
);

const ManageCourse = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [activeTab, setActiveTab] = useState('basics');
    const [hasChanges, setHasChanges] = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        category: '',
        level: 'beginner',
        price: '',
        isFree: false,
        thumbnail: null
    });

    const tabs = [
        { id: 'basics', label: 'Basics' },
        { id: 'pricing', label: 'Pricing & Media' },
        { id: 'lectures', label: 'Lectures' },
        { id: 'settings', label: 'Settings' }
    ];

    const categories = ['Web Development', 'Mobile Development', 'Data Science', 'Design', 'Marketing', 'Business', 'Photography', 'Music'];

    const inputStyle = {
        width: '100%',
        padding: '14px 16px',
        fontSize: '0.9375rem',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        backgroundColor: 'white',
        transition: 'all 0.2s ease',
        outline: 'none'
    };

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await courseService.getCourseDetails(courseId);
                if (response.success && response.data) {
                    const c = response.data;
                    setCourse(c);
                    setFormData({
                        title: c.title || '',
                        subtitle: c.subtitle || '',
                        description: c.description || '',
                        category: c.category || '',
                        level: c.level || 'beginner',
                        price: c.price || '',
                        isFree: c.price === 0,
                        thumbnail: null
                    });
                    if (c.thumbnail) setThumbnailPreview(c.thumbnail);
                } else {
                    setError('Course not found');
                }
            } catch (err) {
                setError('Failed to load course');
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setHasChanges(true);
        if (name === 'thumbnail' && files?.[0]) {
            setFormData(prev => ({ ...prev, thumbnail: files[0] }));
            setThumbnailPreview(URL.createObjectURL(files[0]));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setFormData(prev => ({ ...prev, thumbnail: file }));
            setThumbnailPreview(URL.createObjectURL(file));
            setHasChanges(true);
        }
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();
        setError(null);
        setSuccess(null);
        setSubmitting(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('subtitle', formData.subtitle);
            data.append('description', formData.description);
            data.append('category', formData.category);
            data.append('level', formData.level);
            data.append('price', formData.isFree ? '0' : formData.price);
            if (formData.thumbnail) {
                data.append('thumbnail', formData.thumbnail);
            }

            const response = await courseService.updateCourse(courseId, data);
            if (response.success) {
                setSuccess('Course updated successfully!');
                setCourse(response.data);
                setHasChanges(false);
                setTimeout(() => setSuccess(null), 3000);
            } else {
                setError(response.message || 'Failed to update course');
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    const handlePublish = async () => {
        try {
            const res = await courseService.togglePublish(courseId);
            if (res.success) {
                setCourse(res.data);
                setSuccess(res.message);
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err) {
            setError('Failed to update publish status');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
            try {
                const response = await courseService.deleteCourse(courseId);
                if (response.success) {
                    navigate('/instructor');
                } else {
                    setError(response.message || 'Failed to delete course');
                }
            } catch (err) {
                setError(err.message || 'Failed to delete course');
            }
        }
    };

    // Calculate course health
    const totalLectures = course?.modules?.reduce((acc, m) => acc + (m.lectures?.length || 0), 0) || 0;
    const healthChecks = [
        { label: 'Title added', done: !!formData.title },
        { label: 'Description added', done: !!formData.description },
        { label: 'Thumbnail uploaded', done: !!thumbnailPreview },
        { label: 'Lectures added', done: totalLectures > 0 }
    ];
    const healthScore = Math.round((healthChecks.filter(c => c.done).length / healthChecks.length) * 100);

    if (loading) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                <Spinner />
                <p style={{ color: '#64748b', marginTop: '16px' }}>Loading course...</p>
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
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '32px',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}
            >
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h1 style={{
                            fontSize: '1.75rem',
                            fontWeight: '700',
                            color: '#0f172a',
                            margin: 0
                        }}>
                            {formData.title || 'Untitled Course'}
                        </h1>
                        <StatusBadge isPublished={course.isPublished} />
                    </div>
                    <p style={{ fontSize: '0.9375rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {hasChanges ? (
                            <span style={{ color: '#f59e0b' }}>● Unsaved changes</span>
                        ) : (
                            <span style={{ color: '#10b981' }}>✓ All changes saved</span>
                        )}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                        type="button"
                        onClick={handlePublish}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: 'white',
                            color: course.isPublished ? '#f59e0b' : '#10b981',
                            border: `1px solid ${course.isPublished ? '#fcd34d' : '#6ee7b7'}`,
                            borderRadius: '10px',
                            fontWeight: '600',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {course.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <motion.button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        whileHover={{ scale: submitting ? 1 : 1.02 }}
                        whileTap={{ scale: submitting ? 1 : 0.98 }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 24px',
                            background: submitting ? '#a78bfa' : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontWeight: '600',
                            fontSize: '0.875rem',
                            cursor: submitting ? 'not-allowed' : 'pointer',
                            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {submitting ? <Spinner /> : <SaveIcon />}
                        {submitting ? 'Saving...' : 'Save Changes'}
                    </motion.button>
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
                        <CheckIcon /> {success}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tabs */}
            <div style={{
                display: 'flex',
                gap: '4px',
                marginBottom: '24px',
                padding: '4px',
                backgroundColor: '#f1f5f9',
                borderRadius: '12px',
                width: 'fit-content'
            }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '10px 20px',
                            border: 'none',
                            backgroundColor: activeTab === tab.id ? 'white' : 'transparent',
                            color: activeTab === tab.id ? '#0f172a' : '#64748b',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.875rem',
                            transition: 'all 0.2s ease',
                            boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div style={{ display: 'flex', gap: '24px' }}>
                {/* Main Content */}
                <div style={{ flex: 1 }}>
                    <motion.div
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            padding: '32px',
                            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)'
                        }}
                    >
                        <AnimatePresence mode="wait">
                            {activeTab === 'basics' && (
                                <motion.div
                                    key="basics"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FormInput label="Course Title" required helper="Clear, benefit-driven titles perform best.">
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            style={inputStyle}
                                            onFocus={(e) => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)'; }}
                                            onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                                        />
                                    </FormInput>

                                    <FormInput label="Subtitle" helper={`${formData.subtitle.length}/120 characters`}>
                                        <input
                                            type="text"
                                            name="subtitle"
                                            value={formData.subtitle}
                                            onChange={handleChange}
                                            maxLength={120}
                                            style={inputStyle}
                                            onFocus={(e) => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)'; }}
                                            onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                                        />
                                    </FormInput>

                                    <FormInput label="Description" helper="By the end of this course, students will be able to...">
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={5}
                                            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                                            onFocus={(e) => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)'; }}
                                            onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                                        />
                                    </FormInput>

                                    <FormInput label="Category" required>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            style={{ ...inputStyle, cursor: 'pointer' }}
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </FormInput>

                                    <FormInput label="Level" required>
                                        <LevelSelector
                                            value={formData.level}
                                            onChange={(level) => { setFormData(prev => ({ ...prev, level })); setHasChanges(true); }}
                                        />
                                    </FormInput>
                                </motion.div>
                            )}

                            {activeTab === 'pricing' && (
                                <motion.div
                                    key="pricing"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {/* Thumbnail */}
                                    <FormInput label="Course Thumbnail" helper="Recommended: 1280x720px (16:9 ratio)">
                                        <div
                                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                            onDragLeave={() => setIsDragging(false)}
                                            onDrop={handleDrop}
                                            onClick={() => fileInputRef.current?.click()}
                                            style={{
                                                border: `2px dashed ${isDragging ? '#8b5cf6' : '#e2e8f0'}`,
                                                borderRadius: '16px',
                                                padding: thumbnailPreview ? '0' : '40px',
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                backgroundColor: isDragging ? 'rgba(139, 92, 246, 0.05)' : '#fafafa',
                                                transition: 'all 0.2s ease',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {thumbnailPreview ? (
                                                <div style={{ position: 'relative' }}>
                                                    <img
                                                        src={thumbnailPreview}
                                                        alt="Preview"
                                                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                                    />
                                                    <div style={{
                                                        position: 'absolute',
                                                        bottom: '12px',
                                                        right: '12px',
                                                        backgroundColor: 'white',
                                                        padding: '8px 16px',
                                                        borderRadius: '8px',
                                                        fontSize: '0.8rem',
                                                        fontWeight: '600',
                                                        color: '#64748b',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                    }}>
                                                        Click to change
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div style={{ color: '#94a3b8', marginBottom: '12px' }}>
                                                        <UploadIcon />
                                                    </div>
                                                    <p style={{ fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                                                        Drop your image here, or <span style={{ color: '#8b5cf6' }}>browse</span>
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            name="thumbnail"
                                            accept="image/*"
                                            onChange={handleChange}
                                            style={{ display: 'none' }}
                                        />
                                    </FormInput>

                                    {/* Pricing */}
                                    <FormInput label="Pricing">
                                        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                            <button
                                                type="button"
                                                onClick={() => { setFormData(prev => ({ ...prev, isFree: false })); setHasChanges(true); }}
                                                style={{
                                                    padding: '12px 24px',
                                                    borderRadius: '12px',
                                                    border: !formData.isFree ? 'none' : '1px solid #e2e8f0',
                                                    background: !formData.isFree ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : 'white',
                                                    color: !formData.isFree ? 'white' : '#64748b',
                                                    fontWeight: '600',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Paid Course
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setFormData(prev => ({ ...prev, isFree: true, price: '0' })); setHasChanges(true); }}
                                                style={{
                                                    padding: '12px 24px',
                                                    borderRadius: '12px',
                                                    border: formData.isFree ? 'none' : '1px solid #e2e8f0',
                                                    background: formData.isFree ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'white',
                                                    color: formData.isFree ? 'white' : '#64748b',
                                                    fontWeight: '600',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Free Course
                                            </button>
                                        </div>
                                        {!formData.isFree && (
                                            <div style={{ position: 'relative' }}>
                                                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontWeight: '600' }}>₹</span>
                                                <input
                                                    type="number"
                                                    name="price"
                                                    min="0"
                                                    value={formData.price}
                                                    onChange={handleChange}
                                                    style={{ ...inputStyle, paddingLeft: '36px' }}
                                                    onFocus={(e) => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)'; }}
                                                    onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                                                />
                                            </div>
                                        )}
                                    </FormInput>
                                </motion.div>
                            )}

                            {activeTab === 'lectures' && (
                                <motion.div
                                    key="lectures"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                                        <div style={{
                                            fontSize: '3rem',
                                            fontWeight: '700',
                                            color: '#0f172a',
                                            marginBottom: '8px'
                                        }}>
                                            {totalLectures}
                                        </div>
                                        <p style={{ color: '#64748b', marginBottom: '24px' }}>
                                            Total lectures in this course
                                        </p>

                                        {totalLectures === 0 && (
                                            <div style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '12px 20px',
                                                backgroundColor: '#fef3c7',
                                                color: '#92400e',
                                                borderRadius: '10px',
                                                marginBottom: '24px',
                                                fontSize: '0.875rem',
                                                fontWeight: '600'
                                            }}>
                                                <AlertIcon />
                                                Add lectures to make your course complete
                                            </div>
                                        )}

                                        <Link
                                            to={`/instructor/course/${courseId}/lectures`}
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
                                                boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)'
                                            }}
                                        >
                                            <PlayIcon />
                                            Manage Lectures
                                        </Link>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'settings' && (
                                <motion.div
                                    key="settings"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#0f172a', marginBottom: '24px' }}>
                                        Course Settings
                                    </h3>

                                    <div style={{
                                        padding: '20px',
                                        backgroundColor: '#f8fafc',
                                        borderRadius: '12px',
                                        marginBottom: '24px'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>
                                                    Course Visibility
                                                </div>
                                                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                                    {course.isPublished ? 'This course is visible to students' : 'This course is hidden from students'}
                                                </div>
                                            </div>
                                            <StatusBadge isPublished={course.isPublished} />
                                        </div>
                                    </div>

                                    {/* Danger Zone */}
                                    <div style={{
                                        marginTop: '40px',
                                        padding: '24px',
                                        border: '1px solid #fecaca',
                                        borderRadius: '16px'
                                    }}>
                                        <h4 style={{ color: '#dc2626', marginBottom: '12px', fontWeight: '700' }}>
                                            Danger Zone
                                        </h4>
                                        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '20px' }}>
                                            Once you delete a course, there is no going back. Please be certain.
                                        </p>
                                        <motion.button
                                            type="button"
                                            onClick={handleDelete}
                                            whileHover={{ scale: 1.02, backgroundColor: '#fef2f2' }}
                                            whileTap={{ scale: 0.98 }}
                                            style={{
                                                padding: '12px 24px',
                                                backgroundColor: 'transparent',
                                                color: '#dc2626',
                                                border: '1px solid #fecaca',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                fontWeight: '600',
                                                fontSize: '0.875rem',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            Delete Course
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* Sidebar - Course Health */}
                <div style={{ width: '280px', flexShrink: 0 }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
                        position: 'sticky',
                        top: '90px'
                    }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#64748b', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Course Health
                        </h3>

                        {/* Progress */}
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Readiness</span>
                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#8b5cf6' }}>{healthScore}%</span>
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
                                    animate={{ width: `${healthScore}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    style={{
                                        height: '100%',
                                        background: healthScore === 100
                                            ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                                            : 'linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%)',
                                        borderRadius: '10px'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Checklist */}
                        {healthChecks.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: item.done ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#e2e8f0',
                                    color: 'white',
                                    fontSize: '10px'
                                }}>
                                    {item.done && <CheckIcon />}
                                </div>
                                <span style={{
                                    fontSize: '0.875rem',
                                    color: item.done ? '#0f172a' : '#94a3b8',
                                    textDecoration: item.done ? 'none' : 'none'
                                }}>
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ManageCourse;
