import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { login as loginApi } from '../services/api';
import '../css/Auth.css';

const Login = () => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const { darkMode } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await loginApi(emailOrUsername, password);
            if (response.status === 200 && response.data?.user) {
                const { user, token } = response.data;
                if (!user.role) {
                    setError('Invalid user data received');
                    return;
                }
                localStorage.setItem('token', token);
                login(user);
                navigate(`/${user.role.toLowerCase()}-home`);
            } else {
                // Convert error object to string if needed
                setError(typeof response.error === 'string' ? response.error : 'Invalid credentials');
            }
        } catch (error) {
            setError('Failed to login. Please try again.');
        }
    };

    return (
        <div className={`auth-container ${darkMode ? 'dark' : 'light'}`}>
            <div className="auth-box">
                <h2>Login</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="emailOrUsername">Email or Username</label>
                        <input
                            type="text"
                            id="emailOrUsername"
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                            placeholder="Enter your email or username"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" className="auth-submit">
                        Login
                    </button>
                </form>
                <p className="auth-switch">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
                <div className="demo-credentials">
                    <p>Demo Credentials:</p>
                    <p>Designer: designer@example.com / password</p>
                    <p>Player: player@example.com / password</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
