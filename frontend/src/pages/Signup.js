import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { signup } from '../services/api';
import '../css/Auth.css';
import '../css/Button.css';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('player');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { darkMode } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validation
            if (!email.trim()) {
                setError('Email is required');
                return;
            }
            if (!username.trim()) {
                setError('Username is required');
                return;
            }
            if (!password) {
                setError('Password is required');
                return;
            }
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }

            const userData = {
                email: email.trim(),
                password,
                username: username.trim(),
                name: name.trim(),
                role
            };

            const response = await signup(userData);
            
            if (response.status === 200 && response.data?.user) {
                const { user, token } = response.data;
                localStorage.setItem('token', token);
                login(user);
                navigate(`/${user.role.toLowerCase()}-home`);
            } else {
                setError(response.error || 'Signup failed. Please try again.');
            }
        } catch (err) {
            setError(err.message || 'An error occurred during signup');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`auth-container ${darkMode ? 'dark' : 'light'}`}>
            <div className="auth-box">
                <h2>Sign Up</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Choose a username"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Name (Optional):</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Role:</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="player">Player</option>
                            <option value="designer">Designer</option>
                        </select>
                    </div>
                    <button 
                        type="submit" 
                        className={`auth-submit custom-button primary ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Signing up...' : 'Sign Up'}
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
