import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { signup } from '../services/api';
import '../css/Auth.css';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('player');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const { darkMode } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const userData = {
                email,
                password,
                name: name || email.split('@')[0], // Use name if provided, otherwise use email username
                role
            };

            const response = await signup(userData);
            if (response.status === 200 && response.data?.user) {
                const { user, token } = response.data;
                // Ensure user object has all required fields
                if (!user.role) {
                    setError('Invalid user data received');
                    return;
                }
                // Store token in localStorage
                localStorage.setItem('token', token);
                // Call the context login function to update global state
                login(user);
                // Navigate based on user role
                navigate(`/${user.role.toLowerCase()}-home`);
            } else {
                setError(response.error || 'Failed to create account');
            }
        } catch (err) {
            setError('Failed to create account. Please try again.');
            console.error('Signup error:', err);
        }
    };

    return (
        <div className={`auth-container ${darkMode ? 'dark' : 'light'}`}>
            <div className="auth-box">
                <h2>Sign Up</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Optional"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="player">Player</option>
                            <option value="designer">Designer</option>
                        </select>
                    </div>
                    <button type="submit" className="auth-submit">
                        Sign Up
                    </button>
                </form>
                <p className="auth-switch">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
