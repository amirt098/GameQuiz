import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import '../css/Home.css';

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { darkMode } = useTheme();

    return (
        <div className={`home ${darkMode ? 'dark' : 'light'}`}>
            <div className="home-content">
                <h1>Welcome to GameQuiz</h1>
                <p>See how you rank against others:</p>

                <div className="leaderboard-link" onClick={() => navigate('/leaderboard')}>
                    <h3>See Leaderboard</h3>
                </div>
            </div>
        </div>
    );
};

// Updated Home.js to remove game modes and add See Leaderboard link

export default Home;