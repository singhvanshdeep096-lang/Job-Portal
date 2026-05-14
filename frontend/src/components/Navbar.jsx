import React from 'react';
import { useLocation, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Briefcase, Users, User, LogOut, LogIn, MessageSquare, Bookmark, Zap, Bell } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar glass">
            <div className="container nav-content">
                <Link to="/" className="logo">
                    <Briefcase size={28} color="#6366f1" />
                    <span>RecruitPortal</span>
                </Link>

                <div className="nav-links">
                    <NavLink to={user?.role === 'employer' ? '/employer-dashboard' : '/employee-dashboard'}>Dashboard</NavLink>
                    <NavLink to="/applications">Applications</NavLink>
                    
                    {user?.role === 'employer' && (
                        <NavLink to="/employer/jobs">My Jobs</NavLink>
                    )}

                    {user?.role === 'employee' && (
                        <>
                            <NavLink to="/jobs">Find Jobs</NavLink>
                            <NavLink to="/saved-jobs">Saved</NavLink>
                        </>
                    )}

                    <div className="nav-user">
                        <NotificationDropdown />
                        <NavLink to="/profile" title="Profile">
                            <User size={20} />
                        </NavLink>
                        <button onClick={handleLogout} className="btn-logout" title="Logout">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
