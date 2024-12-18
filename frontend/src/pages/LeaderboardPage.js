import React from "react";
import { useTheme } from "../context/ThemeContext";
import Leaderboard from "../components/Leaderboard";
import "../css/LeaderboardPage.css";

const LeaderboardPage = () => {
    const { darkMode } = useTheme();

    return (
        <div className={`leaderboard-page ${darkMode ? 'dark' : 'light'}`}>
            <div className="leaderboard-content">
                <h1>Leaderboard</h1>
                <div className="leaderboard-container">
                    <Leaderboard />
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;
