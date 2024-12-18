import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getQuestions, getCategories } from '../services/api';
import '../css/QuestionList.css';

const QuestionList = ({ viewMode = 'grid', searchTerm = '', filters = {}, showAllQuestions = false }) => {
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
                console.log('Questions response:', response); // Debug log
                if (response && Array.isArray(response.questions)) {
                    setQuestions(response.questions);
                } else {
                    console.error('Invalid questions data:', response);
                    setError('Error loading questions');
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
                setError('Error loading questions');
            }
            setLoading(false);
        };

        fetchData();
    }, [filters, showAllQuestions]);

    const filteredQuestions = questions.filter(question => {
        if (!question) return false;
        
        const matchesSearch = searchTerm
            ? (question.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               question.question?.toLowerCase().includes(searchTerm.toLowerCase()))
            : true;

        const matchesCategory = filters.category
            ? question.category?.toLowerCase() === filters.category.toLowerCase()
            : true;

        const matchesDifficulty = filters.difficulty
            ? question.difficulty?.toLowerCase() === filters.difficulty.toLowerCase()
            : true;

        const matchesStatus = filters.status
            ? question.status?.toLowerCase() === filters.status.toLowerCase()
            : true;

        return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
    });

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
                        <div key={question.id} className="question-card">
                            <h3>{question.title}</h3>
                            <p className="question-text">{question.question}</p>
                            <div className="question-meta">
                                <span className={`difficulty ${question.difficulty}`}>
                                    {question.difficulty}
                                </span>
                                <span className="category">{question.category}</span>
                            </div>
                            <div className="question-footer">
                                <span className="designer">By: {question.designer || 'Unknown'}</span>
                                <span className={`status ${question.status || 'active'}`}>
                                    {question.status || 'active'}
                                </span>
                            </div>
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
                                <th>Designer</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredQuestions.map(question => (
                                <tr key={question.id}>
                                    <td>{question.title}</td>
                                    <td>{question.question}</td>
                                    <td>{question.category}</td>
                                    <td>
                                        <span className={`difficulty ${question.difficulty}`}>
                                            {question.difficulty}
                                        </span>
                                    </td>
                                    <td>{question.designer || 'Unknown'}</td>
                                    <td>
                                        <span className={`status ${question.status || 'active'}`}>
                                            {question.status || 'active'}
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
