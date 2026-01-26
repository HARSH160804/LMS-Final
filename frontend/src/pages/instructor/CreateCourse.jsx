import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import courseService from '../../services/course.service';

// Icons
const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const UploadIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const ImageIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
    </svg>
);

const Spinner = () => (
    <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}
    />
);

// Step Progress Indicator
const StepIndicator = ({ currentStep, steps }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', marginBottom: '40px' }}>
        {steps.map((step, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: currentStep >= index ? 1 : 0.9 }}
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: currentStep > index
                            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                            : currentStep === index
                                ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
                                : '#e2e8f0',
                        color: currentStep >= index ? 'white' : '#94a3b8',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        boxShadow: currentStep === index ? '0 0 20px rgba(139, 92, 246, 0.4)' : 'none',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {currentStep > index ? <CheckIcon /> : index + 1}
                </motion.div>
                <div style={{ textAlign: 'center', marginLeft: '8px', marginRight: index < steps.length - 1 ? '0' : '0' }}>
                    <div style={{
                        fontSize: '0.75rem',
                        fontWeight: currentStep === index ? '600' : '500',
                        color: currentStep === index ? '#0f172a' : '#64748b'
                    }}>
                        {step}
                    </div>
                </div>
                {index < steps.length - 1 && (
                    <div style={{
                        width: '60px',
                        height: '2px',
                        backgroundColor: currentStep > index ? '#10b981' : '#e2e8f0',
                        margin: '0 12px',
                        transition: 'all 0.3s ease'
                    }} />
                )}
            </div>
        ))}
    </div>
);

// Input with floating label style
const FormInput = ({ label, required, helper, error, children }) => (
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
        {helper && !error && (
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '6px' }}>{helper}</p>
        )}
        {error && (
            <p style={{ fontSize: '0.8rem', color: '#ef4444', marginTop: '6px' }}>{error}</p>
        )}
    </div>
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

const CreateCourse = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
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

    const steps = ['Basic Info', 'Pricing & Media', 'Review'];

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

    const handleChange = (e) => {
        const { name, value, files } = e.target;
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
        }
    };

    const handleSubmit = async (asDraft = false) => {
        setError(null);
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

            const response = await courseService.createCourse(data);
            if (response.success) {
                navigate(`/instructor/course/${response.data._id}`);
            } else {
                setError(response.message || 'Failed to create course');
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    const canProceed = () => {
        if (currentStep === 0) {
            return formData.title && formData.category;
        }
        if (currentStep === 1) {
            return (formData.isFree || formData.price) && formData.thumbnail;
        }
        return true;
    };

    const categories = ['Web Development', 'Mobile Development', 'Data Science', 'Design', 'Marketing', 'Business', 'Photography', 'Music'];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{ maxWidth: '700px', margin: '0 auto' }}
        >
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: '32px' }}
            >
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#0f172a',
                    marginBottom: '8px'
                }}>
                    Create New Course
                </h1>
                <p style={{ fontSize: '1rem', color: '#64748b', maxWidth: '450px', margin: '0 auto' }}>
                    Create a course students will love. You can edit everything later.
                </p>
            </motion.header>

            {/* Step Indicator */}
            <StepIndicator currentStep={currentStep} steps={steps} />

            {/* Error */}
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
                            marginBottom: '24px',
                            border: '1px solid #fecaca'
                        }}
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Form Card */}
            <motion.div
                style={{
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    padding: '32px',
                    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)'
                }}
            >
                <AnimatePresence mode="wait">
                    {/* Step 1: Basic Info */}
                    {currentStep === 0 && (
                        <motion.div
                            key="step1"
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
                                    placeholder="e.g., Complete React Developer Course"
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
                                    placeholder="A brief tagline for your course"
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
                                    placeholder="Describe what students will learn and accomplish..."
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
                                    onChange={(level) => setFormData(prev => ({ ...prev, level }))}
                                />
                            </FormInput>
                        </motion.div>
                    )}

                    {/* Step 2: Pricing & Media */}
                    {currentStep === 1 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Free/Paid Toggle */}
                            <FormInput label="Pricing">
                                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, isFree: false }))}
                                        style={{
                                            padding: '12px 24px',
                                            borderRadius: '12px',
                                            border: !formData.isFree ? 'none' : '1px solid #e2e8f0',
                                            background: !formData.isFree ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : 'white',
                                            color: !formData.isFree ? 'white' : '#64748b',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        Paid Course
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, isFree: true, price: '0' }))}
                                        style={{
                                            padding: '12px 24px',
                                            borderRadius: '12px',
                                            border: formData.isFree ? 'none' : '1px solid #e2e8f0',
                                            background: formData.isFree ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'white',
                                            color: formData.isFree ? 'white' : '#64748b',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        Free Course
                                    </button>
                                </div>

                                {!formData.isFree && (
                                    <div>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontWeight: '600' }}>₹</span>
                                            <input
                                                type="number"
                                                name="price"
                                                min="0"
                                                value={formData.price}
                                                onChange={handleChange}
                                                placeholder="999"
                                                style={{ ...inputStyle, paddingLeft: '36px' }}
                                                onFocus={(e) => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)'; }}
                                                onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                                            />
                                        </div>
                                        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '6px' }}>
                                            Most courses in this category are priced between ₹999–₹1999.
                                        </p>
                                    </div>
                                )}
                            </FormInput>

                            {/* Thumbnail Upload */}
                            <FormInput label="Course Thumbnail" required helper="Recommended: 1280x720px (16:9 ratio)">
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
                                            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                                PNG, JPG up to 5MB
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
                        </motion.div>
                    )}

                    {/* Step 3: Review */}
                    {currentStep === 2 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#0f172a', marginBottom: '24px' }}>
                                Review Your Course
                            </h3>

                            {/* Preview Card */}
                            <div style={{
                                border: '1px solid #e2e8f0',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                marginBottom: '24px'
                            }}>
                                {thumbnailPreview && (
                                    <img src={thumbnailPreview} alt="Course" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                                )}
                                <div style={{ padding: '20px' }}>
                                    <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
                                        {formData.title || 'Untitled Course'}
                                    </h4>
                                    {formData.subtitle && (
                                        <p style={{ color: '#64748b', marginBottom: '12px' }}>{formData.subtitle}</p>
                                    )}
                                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            backgroundColor: '#f1f5f9',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            color: '#64748b'
                                        }}>
                                            {formData.category || 'No category'}
                                        </span>
                                        <span style={{
                                            padding: '4px 12px',
                                            backgroundColor: '#f1f5f9',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            color: '#64748b',
                                            textTransform: 'capitalize'
                                        }}>
                                            {formData.level}
                                        </span>
                                        <span style={{
                                            padding: '4px 12px',
                                            background: formData.isFree ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            color: 'white',
                                            fontWeight: '600'
                                        }}>
                                            {formData.isFree ? 'Free' : `₹${formData.price}`}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Checklist */}
                            <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '20px' }}>
                                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Publish Checklist
                                </h4>
                                {[
                                    { label: 'Title added', done: !!formData.title },
                                    { label: 'Category selected', done: !!formData.category },
                                    { label: 'Price set', done: formData.isFree || !!formData.price },
                                    { label: 'Thumbnail uploaded', done: !!formData.thumbnail }
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                        <div style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: item.done ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#e2e8f0',
                                            color: 'white'
                                        }}>
                                            {item.done && <CheckIcon />}
                                        </div>
                                        <span style={{ color: item.done ? '#0f172a' : '#94a3b8', fontWeight: item.done ? '500' : '400' }}>
                                            {item.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Footer Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '24px',
                    paddingTop: '24px',
                    borderTop: '1px solid #e2e8f0'
                }}
            >
                <Link
                    to="/instructor"
                    style={{ color: '#64748b', fontSize: '0.9375rem', textDecoration: 'none' }}
                >
                    Cancel
                </Link>

                <div style={{ display: 'flex', gap: '12px' }}>
                    {currentStep > 0 && (
                        <button
                            type="button"
                            onClick={() => setCurrentStep(prev => prev - 1)}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: 'white',
                                color: '#64748b',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Back
                        </button>
                    )}

                    {currentStep < 2 ? (
                        <motion.button
                            type="button"
                            onClick={() => setCurrentStep(prev => prev + 1)}
                            disabled={!canProceed()}
                            whileHover={{ scale: canProceed() ? 1.02 : 1 }}
                            whileTap={{ scale: canProceed() ? 0.98 : 1 }}
                            style={{
                                padding: '12px 32px',
                                background: canProceed() ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : '#e2e8f0',
                                color: canProceed() ? 'white' : '#94a3b8',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: '600',
                                cursor: canProceed() ? 'pointer' : 'not-allowed',
                                boxShadow: canProceed() ? '0 4px 16px rgba(139, 92, 246, 0.3)' : 'none',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Continue
                        </motion.button>
                    ) : (
                        <motion.button
                            type="button"
                            onClick={() => handleSubmit(false)}
                            disabled={submitting}
                            whileHover={{ scale: submitting ? 1 : 1.02 }}
                            whileTap={{ scale: submitting ? 1 : 0.98 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '12px 32px',
                                background: submitting ? '#a78bfa' : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: '600',
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {submitting && <Spinner />}
                            {submitting ? 'Creating...' : 'Create Course'}
                        </motion.button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default CreateCourse;
