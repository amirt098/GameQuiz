import React from "react";
import Leaderboard from "../components/Leaderboard";
import "../css/LeaderboardPage.css";

const LeaderboardPage = () => {
    return (
        <div className="leaderboard-page">
            <h1>Leaderboard</h1>
            <div className="leaderboard-container">
                <Leaderboard />
            </div>
        </div>
    );
};

export default LeaderboardPage;
