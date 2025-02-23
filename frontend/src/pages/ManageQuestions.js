import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { getCategories } from "../services/api";
import QuestionList from "../components/QuestionList";
import QuestionForm from "../components/QuestionForm";
import Modal from "../components/Modal";
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
    const [activeTab, setActiveTab] = useState('my-questions');
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                if (response?.status === 200 && response.data) {
                    // Ensure we're getting an array of strings
                    const categoryList = Array.isArray(response.data.categories) 
                        ? response.data.categories.map(cat => typeof cat === 'object' ? cat.name : cat)
                        : [];
                    setCategories(categoryList);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories([]);
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

    const handleQuestionClick = (question) => {
        setEditingQuestion(question);
        setShowEditModal(true);
    };

    const handleQuestionUpdate = (updatedQuestion) => {
        setShowEditModal(false);
        setEditingQuestion(null);
        // You might want to refresh the questions list here
    };

    const currentFilters = {
        ...selectedFilters,
        designer: activeTab === 'my-questions' ? (user?.id || '') : ''
    };

    return (
        <div className={`manage-questions-page ${darkMode ? 'dark' : 'light'}`}>
            <div className="page-header">
                <h1>Manage Questions</h1>
                <Link to="/create-question" className="create-button">
                    Create New Question
                </Link>
            </div>

            {user?.role === 'designer' && (
                <div className="tabs">
                    <button
                        className={`tab-button ${activeTab === 'my-questions' ? 'active' : ''}`}
                        onClick={() => setActiveTab('my-questions')}
                    >
                        My Questions
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'all-questions' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all-questions')}
                    >
                        All Questions
                    </button>
                </div>
            )}

            <div className="filters-section">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search questions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filters">
                    <select
                        value={selectedFilters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category}>
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
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    <button onClick={clearFilters} className="clear-filters">
                        Clear Filters
                    </button>
                </div>

                <div className="view-toggle">
                    <button
                        className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                    >
                        Grid View
                    </button>
                    <button
                        className={`view-button ${viewMode === 'table' ? 'active' : ''}`}
                        onClick={() => setViewMode('table')}
                    >
                        Table View
                    </button>
                </div>
            </div>

            <QuestionList
                viewMode={viewMode}
                searchTerm={searchTerm}
                filters={currentFilters}
                onQuestionClick={handleQuestionClick}
            />

            {showEditModal && (
                <Modal
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setEditingQuestion(null);
                    }}
                    title="Edit Question"
                >
                    <QuestionForm
                        initialData={editingQuestion}
                        onSubmit={handleQuestionUpdate}
                    />
                </Modal>
            )}
        </div>
    );
};

export default ManageQuestions;
