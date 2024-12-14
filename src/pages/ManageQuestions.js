import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { getCategories } from "../services/api";
import QuestionList from "../components/QuestionList";
import "../css/ManageQuestions.css";

const ManageQuestions = () => {
    const { darkMode } = useTheme();
    const { user } = useAuth();
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState({
        category: '',
        difficulty: '',
        status: 'active'
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const fetchedCategories = await getCategories();
                setCategories(fetchedCategories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleFilterChange = (filterName, value) => {
        setSelectedFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const clearFilters = () => {
        setSelectedFilters({
            category: '',
            difficulty: '',
            status: 'active'
        });
        setSearchTerm('');
    };

    return (
        <div className={`manage-questions-page ${darkMode ? 'dark' : 'light'}`}>
            <div className="page-header">
                <div className="header-content">
                    <h1>Manage Questions</h1>
                    <p>Total questions designed by you: {/* Add count here */}</p>
                </div>
                <Link to="/create-question" className="create-button">
                    Create New Question
                </Link>
            </div>

            <div className="controls-section">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search questions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="view-controls">
                    <button
                        className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                    >
                        Grid View
                    </button>
                    <button
                        className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                    >
                        List View
                    </button>
                </div>
            </div>

            <div className="filters-section">
                <div className="filters-content">
                    <select
                        value={selectedFilters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedFilters.difficulty}
                        onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                    >
                        <option value="">All Difficulties</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>

                    <select
                        value={selectedFilters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="archived">Archived</option>
                    </select>

                    <button onClick={clearFilters} className="clear-filters">
                        Clear Filters
                    </button>
                </div>
            </div>

            <div className="questions-container">
                <QuestionList 
                    viewMode={viewMode}
                    searchTerm={searchTerm}
                    filters={{
                        ...selectedFilters,
                        designer: user.name
                    }}
                />
            </div>
        </div>
    );
};

export default ManageQuestions;
