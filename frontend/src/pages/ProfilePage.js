import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../services/api';
import '../css/ProfilePage.css';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const mockUserId = "user123"; // This would come from authentication

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userProfile = await getUserProfile(mockUserId);
                setProfile(userProfile);
                setEditForm(userProfile);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching profile:', error);
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleEdit = () => {
        setEditing(true);
    };

    const handleSave = async () => {
        try {
            const updatedProfile = await updateUserProfile(mockUserId, editForm);
            setProfile(updatedProfile);
            setEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleCancel = () => {
        setEditForm(profile);
        setEditing(false);
    };

    const handleChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    if (loading) {
        return <div className="profile-page">Loading...</div>;
    }

    if (!profile) {
        return <div className="profile-page">Profile not found</div>;
    }

    const renderPlayerProfile = () => (
        <div className="profile-content">
            <div className="profile-header">
                <div className="profile-avatar">
                    <span className="avatar-placeholder">
                        {profile.username.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div className="profile-info">
                    {editing ? (
                        <input
                            type="text"
                            name="username"
                            value={editForm.username}
                            onChange={handleChange}
                            className="edit-input"
                        />
                    ) : (
                        <h2>{profile.username}</h2>
                    )}
                    <p className="role">{profile.role}</p>
                    <p className="join-date">Joined: {new Date(profile.joinedDate).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="profile-stats">
                <div className="stat-card">
                    <h3>Total Points</h3>
                    <p>{profile.totalPoints}</p>
                </div>
                <div className="stat-card">
                    <h3>Games Played</h3>
                    <p>{profile.gamesPlayed}</p>
                </div>
                <div className="stat-card">
                    <h3>Correct Answers</h3>
                    <p>{profile.correctAnswers}</p>
                </div>
                <div className="stat-card">
                    <h3>Accuracy</h3>
                    <p>{Math.round((profile.correctAnswers / profile.gamesPlayed) * 100)}%</p>
                </div>
            </div>
        </div>
    );

    const renderDesignerProfile = () => (
        <div className="profile-content">
            <div className="profile-header">
                <div className="profile-avatar">
                    <span className="avatar-placeholder">
                        {profile.username.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div className="profile-info">
                    {editing ? (
                        <input
                            type="text"
                            name="username"
                            value={editForm.username}
                            onChange={handleChange}
                            className="edit-input"
                        />
                    ) : (
                        <h2>{profile.username}</h2>
                    )}
                    <p className="role">{profile.role}</p>
                    <p className="join-date">Joined: {new Date(profile.joinedDate).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="profile-stats">
                <div className="stat-card">
                    <h3>Questions Created</h3>
                    <p>{profile.questionsCreated}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Plays</h3>
                    <p>{profile.questionStats.totalPlays}</p>
                </div>
                <div className="stat-card">
                    <h3>Correct Answers</h3>
                    <p>{profile.questionStats.correctAnswers}</p>
                </div>
                <div className="stat-card">
                    <h3>Average Difficulty</h3>
                    <p>{profile.questionStats.averageDifficulty}</p>
                </div>
            </div>

            <div className="profile-section">
                <h3>Categories Created</h3>
                <div className="categories-list">
                    {profile.categoriesCreated.map((category, index) => (
                        <span key={index} className="category-tag">{category}</span>
                    ))}
                </div>
            </div>

            <div className="profile-section">
                <h3>Top Questions</h3>
                <div className="questions-list">
                    {profile.topQuestions.map((question) => (
                        <div key={question.id} className="question-card">
                            <h4>{question.title}</h4>
                            <div className="question-stats">
                                <span>Plays: {question.plays}</span>
                                <span>Correct Rate: {question.correctRate}</span>
                                <span>Category: {question.category}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="profile-page">
            {profile.role === 'player' ? renderPlayerProfile() : renderDesignerProfile()}
            <div className="profile-actions">
                {editing ? (
                    <>
                        <button onClick={handleSave} className="save-button">Save Changes</button>
                        <button onClick={handleCancel} className="cancel-button">Cancel</button>
                    </>
                ) : (
                    <button onClick={handleEdit} className="edit-button">Edit Profile</button>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
