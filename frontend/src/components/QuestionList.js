import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getQuestions } from '../services/api';
import '../css/QuestionList.css';

const QuestionList = ({ viewMode = 'grid', searchTerm = '', filters = {}, showAllQuestions = false, onQuestionClick }) => {
    const { darkMode } = useTheme();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getQuestions({ ...filters, showAllQuestions });
                console.log('Questions response:', response);

                if (response?.status === 200) {
                    setQuestions(Array.isArray(response.data) ? response.data : []);
                } else {
                    throw new Error(response?.error || 'Failed to load questions');
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
                setError('Error loading questions');
                setQuestions([]);
            }
            setLoading(false);
        };

        fetchData();
    }, [filters, showAllQuestions]);

    const filteredQuestions = questions.filter(question => {
        const searchLower = searchTerm.toLowerCase();
        return (!searchTerm || 
                (question.title && question.title.toLowerCase().includes(searchLower)) ||
                (question.text && question.text.toLowerCase().includes(searchLower))) &&
               (!filters.category || question.category === filters.category) &&
               (!filters.difficulty || question.difficulty === filters.difficulty) &&
               (!filters.status || question.status === filters.status);
    });

    const handleQuestionClick = (question) => {
        if (onQuestionClick && filters.designer) {
            onQuestionClick(question);
        }
    };

    if (loading) {
        return <div className="loading">Loading questions...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!questions.length) {
        return <div className="no-questions">No questions available</div>;
    }

    if (!filteredQuestions.length) {
        return <div className="no-questions">No questions found matching your criteria</div>;
    }

    return (
        <div className={`questions-list ${viewMode} ${darkMode ? 'dark' : 'light'}`}>
            {viewMode === 'grid' ? (
                <div className="questions-grid">
                    {filteredQuestions.map(question => (
                        <div 
                            key={question.id} 
                            className={`question-card ${filters.designer ? 'clickable' : ''}`}
                            onClick={() => handleQuestionClick(question)}
                        >
                            <div className="question-header">
                                <div className="question-meta">
                                    <span className={`difficulty ${question.difficulty}`}>
                                        {question.difficulty}
                                    </span>
                                    <span className="category">{question.category}</span>
                                    <span className={`status ${question.status}`}>
                                        {question.status}
                                    </span>
                                </div>
                            </div>
                            <div className="question-content">
                                <h3 className="question-title">{question.title || 'Untitled Question'}</h3>
                                <p className="question-text">{question.text || 'No question text'}</p>
                                <div className="options">
                                    {question.options && question.options.map((option, index) => (
                                        <div key={index} className="option">
                                            {String.fromCharCode(65 + index)}. {option}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {question.points > 0 && (
                                <div className="points">Points: {question.points}</div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="questions-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Question</th>
                                <th>Category</th>
                                <th>Difficulty</th>
                                <th>Options</th>
                                <th>Points</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredQuestions.map(question => (
                                <tr 
                                    key={question.id}
                                    className={filters.designer ? 'clickable' : ''}
                                    onClick={() => handleQuestionClick(question)}
                                >
                                    <td>{question.title || 'Untitled Question'}</td>
                                    <td>{question.text || 'No question text'}</td>
                                    <td>{question.category}</td>
                                    <td>
                                        <span className={`difficulty ${question.difficulty}`}>
                                            {question.difficulty}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="options-list">
                                            {question.options && question.options.map((option, index) => (
                                                <div key={index}>
                                                    {String.fromCharCode(65 + index)}. {option}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td>{question.points || 0}</td>
                                    <td>
                                        <span className={`status ${question.status}`}>
                                            {question.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default QuestionList;
