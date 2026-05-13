import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Briefcase, Users, User, LogOut, LogIn, MessageSquare, Bookmark, Zap } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar glass">
            <div className="container nav-content">
                <Link to="/" className="logo">
                    <Briefcase size={28} color="#6366f1" />
                    <span>RecruitPortal</span>
                </Link>

                <div className="nav-links">
                    {user ? (
                        <>
                            <NavLink to="/dashboard" end className={({ isActive }) => isActive ? 'active' : ''}>
                                <LayoutDashboard size={20} /> Dashboard
                            </NavLink>
                            <NavLink to="/jobs" className={({ isActive }) => isActive ? 'active' : ''}>
                                <Briefcase size={20} /> Jobs
                            </NavLink>
                            <NavLink to="/applications" className={({ isActive }) => isActive ? 'active' : ''}>
                                <Users size={20} /> Applications
                            </NavLink>
                            <NavLink to="/messages" className={({ isActive }) => isActive ? 'active' : ''}>
                                <MessageSquare size={20} /> Messages
                            </NavLink>
                            <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
                                <User size={20} /> Profile
                            </NavLink>
                            {user.role === 'admin' && (
                                <NavLink to="/admin/skills" className={({ isActive }) => isActive ? 'active' : ''}>
                                    <Zap size={20} /> Skills
                                </NavLink>
                            )}
                            <button onClick={handleLogout} className="btn-logout">
                                <LogOut size={20} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn-login"><LogIn size={20} /> Login</Link>
                            <Link to="/register" className="btn btn-primary">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
