import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getUserProfile, updateUserProfile } from '../services/api';
import '../css/ProfilePage.css';

const ProfilePage = () => {
    const { user, login } = useAuth();
    const { darkMode } = useTheme();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState('');
    const [editForm, setEditForm] = useState({
        name: '',
        username: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.id) {
                setError('No user ID found');
                setLoading(false);
                return;
            }

            try {
                console.log('Fetching profile for user:', user.id);
                const response = await getUserProfile(user.id);
                console.log('Profile response:', response);

                if (response.status === 200 && response.profile) {
                    setProfile(response.profile);
                    setEditForm({
                        name: response.profile.name || '',
                        username: response.profile.username || '',
                        email: response.profile.email || '',
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                    });
                } else {
                    setError(response.error || 'Failed to fetch profile');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                setError('Error fetching profile. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleEdit = () => {
        setEditing(true);
        setError('');
    };

    const handleSave = async () => {
        setError('');
        if (editForm.newPassword && editForm.newPassword !== editForm.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        try {
            const response = await updateUserProfile(user.id, editForm);
            if (response.status === 200 && response.profile) {
                setProfile(response.profile);
                login(response.profile); // Update auth context
                setEditing(false);
                setEditForm({
                    ...editForm,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                setError(response.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Error updating profile. Please try again.');
        }
    };

    const handleCancel = () => {
        setEditing(false);
        setError('');
        setEditForm({
            name: profile?.name || '',
            username: profile?.username || '',
            email: profile?.email || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    const handleChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    if (loading) {
        return (
            <div className={`profile-page ${darkMode ? 'dark' : ''}`}>
                <div className="loading">Loading profile...</div>
            </div>
        );
    }

    if (!profile && error) {
        return (
            <div className={`profile-page ${darkMode ? 'dark' : ''}`}>
                <div className="error-container">
                    <div className="error">{error}</div>
                    <button onClick={() => window.location.reload()} className="retry-button">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`profile-page ${darkMode ? 'dark' : ''}`}>
            <div className="profile-container">
                <h1>Profile</h1>
                {error && <div className="error">{error}</div>}
                
                {!editing ? (
                    <div className="profile-info">
                        <div className="info-row">
                            <label>Username:</label>
                            <span>{profile?.username}</span>
                        </div>
                        <div className="info-row">
                            <label>Email:</label>
                            <span>{profile?.email}</span>
                        </div>
                        <div className="info-row">
                            <label>Name:</label>
                            <span>{profile?.name || 'Not set'}</span>
                        </div>
                        <div className="info-row">
                            <label>Role:</label>
                            <span>{profile?.role}</span>
                        </div>
                        <div className="info-row">
                            <label>Total Points:</label>
                            <span>{profile?.totalPoints || 0}</span>
                        </div>
                        <button onClick={handleEdit} className="edit-button">
                            Edit Profile
                        </button>
                    </div>
                ) : (
                    <div className="edit-form">
                        <div className="form-group">
                            <label>Username:</label>
                            <input
                                type="text"
                                name="username"
                                value={editForm.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={editForm.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={editForm.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Current Password:</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={editForm.currentPassword}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>New Password:</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={editForm.newPassword}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password:</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={editForm.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="button-group">
                            <button onClick={handleSave} className="save-button">
                                Save Changes
                            </button>
                            <button onClick={handleCancel} className="cancel-button">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
