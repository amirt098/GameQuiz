import React, { useEffect, useState } from "react";
import { getLeaderboard } from "../services/api";
import "./../css/Leaderboard.css";

const Leaderboard = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const data = await getLeaderboard();
                setPlayers(data);
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) {
        return <div className="leaderboard">Loading...</div>;
    }

    return (
        <div className="leaderboard">
            <h2>Top Players</h2>
            <div className="leaderboard-list">
                {players.map((player, index) => (
                    <div key={index} className="leaderboard-item">
                        <span className="rank">{index + 1}</span>
                        <span className="player-name">{player.name}</span>
                        <span className="player-score">{player.score}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;
