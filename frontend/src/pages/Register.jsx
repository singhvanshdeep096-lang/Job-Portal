import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import './Auth.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('employee');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await register({ name, email, password, role });
            if (data.user.role === 'employer' || data.user.role === 'admin') {
                navigate('/employer-dashboard');
            } else {
                navigate('/employee-dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container auth-container">
            <motion.div 
                className="card auth-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="auth-header">
                    <UserPlus size={40} className="auth-icon" />
                    <h1>Create Account</h1>
                    <p>Join RecruitPortal to find jobs or the best talent</p>
                </div>

                <div className="role-selector">
                    <button 
                        type="button"
                        className={role === 'employee' ? 'active' : ''} 
                        onClick={() => setRole('employee')}
                    >
                        I am a Job Seeker
                    </button>
                    <button 
                        type="button"
                        className={role === 'employer' ? 'active' : ''} 
                        onClick={() => setRole('employer')}
                    >
                        I am an Employer
                    </button>
                </div>

                {error && (
                    <div className="error-alert">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label className="required-label">Full Name</label>
                        <div className="input-wrapper">
                            <User size={18} className="input-icon" />
                            <input 
                                type="text" 
                                placeholder="John Doe" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required 
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="required-label">Email Address</label>
                        <div className="input-wrapper">
                            <Mail size={18} className="input-icon" />
                            <input 
                                type="email" 
                                placeholder="hr@company.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="required-label">Password</label>
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input 
                                type="password" 
                                placeholder="Min. 6 characters" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength="6"
                                required 
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Creating Account...' : `Register as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
