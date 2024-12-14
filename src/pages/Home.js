import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/Home.css';

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="home">
            <h1>Welcome to GameQuiz</h1>
            <p>See how you rank against others:</p>

            <div className="leaderboard-link" onClick={() => navigate('/leaderboard')}>
                <h3>See Leaderboard</h3>
            </div>
        </div>
    );
};

// Updated Home.js to remove game modes and add See Leaderboard link

export default Home;