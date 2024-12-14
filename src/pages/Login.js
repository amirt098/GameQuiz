import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
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
            // This is a mock login - replace with your actual login logic
            if (email === 'designer@example.com' && password === 'password') {
                login({
                    email,
                    role: 'designer',
                    name: 'Designer User'
                });
                navigate('/designer-home');
            } else if (email === 'player@example.com' && password === 'password') {
                login({
                    email,
                    role: 'player',
                    name: 'Player User'
                });
                navigate('/player-home');
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
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
