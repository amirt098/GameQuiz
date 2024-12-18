import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { login as loginApi } from '../services/api';
import '../css/Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const { darkMode } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await loginApi(email, password);
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
                setError(response.error || 'Invalid email or password');
            }
        } catch (err) {
            setError('Failed to login. Please try again.');
            console.error('Login error:', err);
        }
    };

    return (
        <div className={`auth-container ${darkMode ? 'dark' : 'light'}`}>
            <div className="auth-box">
                <h2>Login</h2>
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
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
