import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import '../css/LeaderboardPage.css';
import '../css/Leaderboard.css';


const LeaderboardPage = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { darkMode } = useTheme();

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            setError('');
            
            const response = await getLeaderboard();
            console.log('Leaderboard response:', response);
            
            if (response.status === 200 && Array.isArray(response.data)) {
                setPlayers(response.data);
            } else {
                throw new Error(response.error || 'Failed to fetch leaderboard');
            }
        } catch (err) {
            console.error('Error in Leaderboard:', err);
            setError('Failed to load leaderboard. Please try again later.');
            setPlayers([]); // Reset to empty array on error
        } finally {
            setLoading(false);
        }
    };

    const getRankStyle = (index) => {
        switch (index) {
            case 0:
                return { backgroundColor: '#FFD700' }; // Gold
            case 1:
                return { backgroundColor: '#C0C0C0' }; // Silver
            case 2:
                return { backgroundColor: '#CD7F32' }; // Bronze
            default:
                return {};
        }
    };

    const renderContent = () => {
        if (loading) {
            return <div className="loading">Loading leaderboard...</div>;
        }

        if (error) {
            return (
                <div className="error-container">
                    <div className="error">{error}</div>
                    <button onClick={fetchLeaderboard} className="retry-button">
                        Try Again
                    </button>
                </div>
            );
        }

        if (!players || players.length === 0) {
            return <div className="no-data">No players found</div>;
        }

        return (
            <div className="leaderboard-table">
                <div className="table-header">
                    <div className="rank">Rank</div>
                    <div className="player">Player</div>
                    <div className="points">Points</div>
                </div>
                {players.map((player, index) => (
                    <div key={index} className="table-row" style={getRankStyle(index)}>
                        <div className="rank">{index + 1}</div>
                        <div className="player">{player.username || 'Unknown Player'}</div>
                        <div className="points">{player.totalPoints || 0}</div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className={`leaderboard-page ${darkMode ? 'dark' : 'light'}`}>
            <div className="leaderboard-content">
                <h1>Leaderboard</h1>
                <div className="leaderboard-container">
                    {renderContent()}
                </div>
                {!loading && !error && (
                    <button onClick={fetchLeaderboard} className="refresh-button">
                        Refresh
                    </button>
                )}
            </div>
        </div>
    );
};

export default LeaderboardPage;
