import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getQuestions, getCategories } from '../services/api';
import '../css/QuestionList.css';

const QuestionList = ({ viewMode = 'grid', searchTerm = '', filters = {} }) => {
    const { darkMode } = useTheme();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [questionsData, categoriesData] = await Promise.all([
                    getQuestions(filters),
                    getCategories()
                ]);
                setQuestions(questionsData.questions);
                setCategories(categoriesData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setLoading(false);
        };

        fetchData();
    }, [filters]);

    const filteredQuestions = questions.filter(question => {
        const matchesSearch = searchTerm
            ? question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              question.question.toLowerCase().includes(searchTerm.toLowerCase())
            : true;

        const matchesCategory = filters.category
            ? question.category === filters.category
            : true;

        const matchesDifficulty = filters.difficulty
            ? question.difficulty === filters.difficulty
            : true;

        const matchesStatus = filters.status
            ? question.status === filters.status
            : true;

        const matchesDesigner = filters.designer
            ? question.designer === filters.designer
            : true;

        return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus && matchesDesigner;
    });

    const getDifficultyColor = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'easy': return 'var(--success-color)';
            case 'medium': return 'var(--warning-color)';
            case 'hard': return 'var(--danger-color)';
            default: return 'var(--text-color)';
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'active': return 'var(--success-color)';
            case 'pending': return 'var(--warning-color)';
            case 'archived': return 'var(--secondary-color)';
            default: return 'var(--text-color)';
        }
    };

    if (loading) {
        return <div className="loading">Loading questions...</div>;
    }

    return (
        <div className={`question-list-container ${darkMode ? 'dark' : 'light'}`}>
            <div className={`questions-${viewMode}`}>
                {filteredQuestions.length === 0 ? (
                    <div className="no-results">
                        No questions found matching your criteria
                    </div>
                ) : (
                    filteredQuestions.map(question => (
                        <div key={question.id} className={`question-${viewMode}-item`}>
                            <div className="question-header">
                                <h3>{question.title}</h3>
                                <div className="badges">
                                    <span 
                                        className="difficulty-badge"
                                        style={{ backgroundColor: getDifficultyColor(question.difficulty) }}
                                    >
                                        {question.difficulty}
                                    </span>
                                    <span 
                                        className="status-badge"
                                        style={{ backgroundColor: getStatusColor(question.status) }}
                                    >
                                        {question.status}
                                    </span>
                                </div>
                            </div>
                            <p className="question-text">{question.question}</p>
                            <div className="question-meta">
                                <span className="category">{question.category}</span>
                                <span className="designer">By {question.designer}</span>
                            </div>
                            <div className="question-actions">
                                <button className="edit-button">Edit</button>
                                <button className="preview-button">Preview</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default QuestionList;
