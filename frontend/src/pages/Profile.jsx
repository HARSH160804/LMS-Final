import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import authService from '../services/auth.service';

// Lock Icon for read-only fields
const LockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

// User Icon for role badge
const UserIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

// Check Icon for success state
const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

// Spinner for loading state
const Spinner = () => (
    <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}
    />
);

const Profile = () => {
    const { user, refreshProfile, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showSuccess, setShowSuccess] = useState(false);

    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        avatar: null
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await authService.updateProfile({
                name: profileData.name
            });
            if (response.success) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
                refreshProfile();
            } else {
                setMessage({ type: 'error', text: response.message || 'Update failed' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'An error occurred' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await authService.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            if (response.success) {
                setMessage({ type: 'success', text: 'Password changed successfully!' });
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setMessage({ type: 'error', text: response.message || 'Password change failed' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'An error occurred' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await authService.deleteAccount();
            if (response.success) {
                logout();
            } else {
                setMessage({ type: 'error', text: 'Failed to delete account' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'An error occurred' });
        }
    };

    // Input styles
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

    const inputFocusStyle = {
        borderColor: '#8b5cf6',
        boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Success Toast */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{
                            position: 'fixed',
                            top: '90px',
                            right: '32px',
                            backgroundColor: '#10b981',
                            color: 'white',
                            padding: '12px 20px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
                            zIndex: 1000
                        }}
                    >
                        <CheckIcon />
                        Profile updated successfully!
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tabs */}
            <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '24px',
                padding: '4px',
                backgroundColor: '#f1f5f9',
                borderRadius: '12px',
                width: 'fit-content'
            }}>
                {['profile', 'security'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '10px 20px',
                            border: 'none',
                            backgroundColor: activeTab === tab ? 'white' : 'transparent',
                            color: activeTab === tab ? '#0f172a' : '#64748b',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.875rem',
                            transition: 'all 0.2s ease',
                            boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            textTransform: 'capitalize'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Error Message */}
            <AnimatePresence>
                {message.text && message.type === 'error' && (
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
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            border: '1px solid #fecaca'
                        }}
                    >
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Profile Tab */}
            <AnimatePresence mode="wait">
                {activeTab === 'profile' && (
                    <motion.div
                        key="profile"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            padding: '32px',
                            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)'
                        }}
                    >
                        <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                            {/* Avatar Section */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '2.5rem',
                                        color: '#fff',
                                        fontWeight: '600',
                                        boxShadow: '0 8px 24px rgba(139, 92, 246, 0.35), 0 0 0 4px rgba(139, 92, 246, 0.1)',
                                        cursor: 'pointer',
                                        position: 'relative'
                                    }}
                                >
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </motion.div>
                                <div>
                                    <div style={{ fontWeight: '700', fontSize: '1.5rem', color: '#0f172a', marginBottom: '4px' }}>
                                        {user?.name}
                                    </div>
                                    <div style={{ color: '#64748b', fontSize: '0.9375rem', marginBottom: '12px' }}>
                                        {user?.email}
                                    </div>
                                    {/* Role Badge */}
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '6px 14px',
                                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.15) 100%)',
                                        color: '#7c3aed',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        textTransform: 'capitalize',
                                        boxShadow: '0 2px 8px rgba(139, 92, 246, 0.15)'
                                    }}>
                                        <UserIcon />
                                        {user?.role || 'Student'}
                                    </div>
                                </div>
                            </div>

                            {/* Full Name Input */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: '#374151'
                                }}>
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                    style={inputStyle}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = inputFocusStyle.borderColor;
                                        e.target.style.boxShadow = inputFocusStyle.boxShadow;
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e2e8f0';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            {/* Email Input (Read-only) */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: '#374151'
                                }}>
                                    Email Address
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        disabled
                                        style={{
                                            ...inputStyle,
                                            backgroundColor: '#f8fafc',
                                            color: '#64748b',
                                            cursor: 'not-allowed',
                                            paddingRight: '44px'
                                        }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        right: '14px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#94a3b8'
                                    }}>
                                        <LockIcon />
                                    </div>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '8px' }}>
                                    Email cannot be changed
                                </p>
                            </div>

                            {/* Save Button */}
                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    padding: '14px 28px',
                                    background: loading ? '#a78bfa' : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: '600',
                                    fontSize: '0.9375rem',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
                                    transition: 'all 0.2s ease',
                                    width: 'fit-content'
                                }}
                            >
                                {loading ? <Spinner /> : null}
                                {loading ? 'Saving...' : 'Save Changes'}
                            </motion.button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Security Tab */}
            <AnimatePresence mode="wait">
                {activeTab === 'security' && (
                    <motion.div
                        key="security"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                    >
                        {/* Change Password Card */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            padding: '28px',
                            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)'
                        }}>
                            <h3 style={{ marginBottom: '24px', fontSize: '1.125rem', fontWeight: '700', color: '#0f172a' }}>
                                Change Password
                            </h3>
                            <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
                                    <div key={field}>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '8px',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            color: '#374151'
                                        }}>
                                            {field === 'currentPassword' ? 'Current Password' :
                                                field === 'newPassword' ? 'New Password' : 'Confirm New Password'}
                                        </label>
                                        <input
                                            type="password"
                                            value={passwordData[field]}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, [field]: e.target.value }))}
                                            required
                                            minLength={field !== 'currentPassword' ? 8 : undefined}
                                            style={inputStyle}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = inputFocusStyle.borderColor;
                                                e.target.style.boxShadow = inputFocusStyle.boxShadow;
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = '#e2e8f0';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                    </div>
                                ))}
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{ scale: loading ? 1 : 1.02 }}
                                    whileTap={{ scale: loading ? 1 : 0.98 }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px',
                                        padding: '14px 28px',
                                        background: loading ? '#a78bfa' : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontWeight: '600',
                                        fontSize: '0.9375rem',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
                                        transition: 'all 0.2s ease',
                                        width: 'fit-content'
                                    }}
                                >
                                    {loading ? <Spinner /> : null}
                                    {loading ? 'Changing...' : 'Change Password'}
                                </motion.button>
                            </form>

                            {/* Success Message for Password */}
                            {message.type === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        marginTop: '20px',
                                        padding: '14px 18px',
                                        backgroundColor: '#ecfdf5',
                                        color: '#059669',
                                        borderRadius: '12px',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        border: '1px solid #a7f3d0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}
                                >
                                    <CheckIcon />
                                    {message.text}
                                </motion.div>
                            )}
                        </div>

                        {/* Danger Zone Card */}
                        <motion.div
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                padding: '28px',
                                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
                                border: '1px solid #fecaca'
                            }}
                            whileHover={{ boxShadow: '0 4px 24px rgba(239, 68, 68, 0.1)' }}
                        >
                            <h3 style={{ color: '#dc2626', marginBottom: '12px', fontSize: '1.125rem', fontWeight: '700' }}>
                                Danger Zone
                            </h3>
                            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px', lineHeight: '1.5' }}>
                                Once you delete your account, there is no going back. Please be certain.
                            </p>
                            <motion.button
                                onClick={handleDeleteAccount}
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
                                Delete Account
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Profile;
