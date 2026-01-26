import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Shared styles for auth forms
const inputStyle = {
    width: '100%',
    padding: '0.875rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '12px',
    fontSize: '0.95rem',
    color: '#1e293b',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
};

const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem'
};

const gradientButtonStyle = {
    width: '100%',
    padding: '0.875rem 1.5rem',
    background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
    marginTop: '0.5rem'
};

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { signup, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const result = await signup(name, email, password);
            if (!result.success) {
                setError(result.message);
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <h2 style={{
                textAlign: 'center',
                marginBottom: '2rem',
                fontSize: '1.75rem',
                fontWeight: '700',
                color: '#1e293b'
            }}>
                Create Account
            </h2>

            {error && (
                <div style={{
                    padding: '0.75rem 1rem',
                    marginBottom: '1rem',
                    backgroundColor: 'rgba(254, 226, 226, 0.8)',
                    color: '#dc2626',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    textAlign: 'center',
                    backdropFilter: 'blur(8px)'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                    <label style={labelStyle}>Full Name</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        style={inputStyle}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#3b82f6';
                            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(226, 232, 240, 0.8)';
                            e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)';
                        }}
                    />
                </div>

                <div>
                    <label style={labelStyle}>Email Address</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        style={inputStyle}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#3b82f6';
                            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(226, 232, 240, 0.8)';
                            e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)';
                        }}
                    />
                </div>

                <div>
                    <label style={labelStyle}>Password</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a strong password"
                        style={inputStyle}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#3b82f6';
                            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(226, 232, 240, 0.8)';
                            e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)';
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    style={{
                        ...gradientButtonStyle,
                        opacity: submitting ? 0.7 : 1,
                        cursor: submitting ? 'not-allowed' : 'pointer'
                    }}
                    onMouseEnter={(e) => {
                        if (!submitting) {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.4)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.3)';
                    }}
                >
                    {submitting ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>

            <p style={{
                marginTop: '1.75rem',
                textAlign: 'center',
                fontSize: '0.875rem',
                color: '#64748b'
            }}>
                Already have an account?{' '}
                <Link to="/login" style={{
                    fontWeight: '600',
                    color: '#3b82f6',
                    textDecoration: 'none'
                }}>
                    Log in
                </Link>
            </p>
        </div>
    );
};

export default Signup;
