import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import '../css/Header.css';

const Header = () => {
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useTheme();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleHomeClick = (e) => {
        e.preventDefault();
        navigate('/');
    };

    return (
        <header className={`header ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="logo">
                <a href="/" onClick={handleHomeClick}>GameQuiz</a>
            </div>
            <nav className={`nav-links ${darkMode ? 'dark' : 'light'}`}>
                {/*<Link to="/">Home</Link>*/}
                <Link to="/leaderboard">
                    Leaderboard 👑</Link>

            </nav>
            <div className={`right-section ${darkMode ? 'dark' : 'light'}`}>
                <button onClick={toggleDarkMode} className={`theme-toggle ${darkMode ? 'dark' : 'light'}`}>
                    {darkMode ? '☀️' : '🌙'}
                </button>
                {user && (
                    <Link to="/profile" className="profile-link">
                        <span className="profile-icon">👤</span>
                        Profile
                    </Link>
                )}
                {user ? (
                    <button onClick={handleLogout} className="auth-button logout-btn">
                        Logout 🫢
                    </button>
                ) : (
                    <>
                        <Link to="/login" className="auth-button login-btn">Login 😎</Link>
                        <Link to="/signup" className="auth-button signup-btn">Sign Up 😍</Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
