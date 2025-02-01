import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRandomQuestion, getQuestionsByCategory, submitAnswer } from '../services/api';
import '../css/PlayGame.css';

const PlayGame = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const gameMode = location.state?.mode || 'random';
    const category = location.state?.category;

    const [question, setQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [score, setScore] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const loadQuestions = async () => {
        setLoading(true);
        setError('');
        try {
            if (gameMode === 'category' && category) {
                const response = await getQuestionsByCategory(category);
                if (response?.status === 200 && Array.isArray(response.data)) {
                    const validQuestions = response.data.filter(q => q && q.id && Array.isArray(q.options));
                    if (validQuestions.length > 0) {
                        setQuestions(validQuestions);
                        setQuestion(validQuestions[0]);
                    } else {
                        throw new Error('No valid questions available in this category');
                    }
                } else {
                    throw new Error('Failed to load category questions');
                }
            } else {
                const response = await getRandomQuestion();
                if (response?.status === 200 && response.data) {
                    setQuestion(response.data);
                } else {
                    throw new Error('Failed to load random question');
                }
            }
        } catch (error) {
            console.error('Error loading questions:', error);
            setError(error.message || 'Failed to load questions. Please try again.');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!location.state) {
            navigate('/');
            return;
        }
        loadQuestions();
    }, [location.state, navigate]);

    const handleAnswerSelect = async (answerIndex) => {
        if (selectedAnswer !== null || loading || !question?.id) return;
        
        setSelectedAnswer(answerIndex);
        try {
            const response = await submitAnswer(question.id, answerIndex);
            if (response?.status === 200) {
                setResult(response.data);
                if (response.data?.correct) {
                    setScore(prevScore => prevScore + (response.data.points || 0));
                }
            } else {
                throw new Error('Failed to submit answer');
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
            setError(error.message || 'Failed to submit answer. Please try again.');
        }
    };

    const handleNextQuestion = async () => {
        setError('');
        if (gameMode === 'category') {
            if (currentQuestionIndex + 1 < questions.length) {
                setCurrentQuestionIndex(prev => prev + 1);
                setQuestion(questions[currentQuestionIndex + 1]);
                setSelectedAnswer(null);
                setResult(null);
            } else {
                navigate('/', { 
                    state: { 
                        completedCategory: category,
                        finalScore: score 
                    }
                });
            }
        } else {
            await loadQuestions();
            setSelectedAnswer(null);
            setResult(null);
        }
    };

    if (loading) {
        return (
            <div className="play-game">
                <div className="loading-spinner">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="play-game">
                <div className="error-message">
                    <p>{error}</p>
                    <button className="btn-primary" onClick={() => navigate('/')}>
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    if (!question) {
        return (
            <div className="play-game">
                <div className="error-message">
                    <p>No questions available.</p>
                    <button className="btn-primary" onClick={() => navigate('/')}>
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="play-game">
            <div className="game-header">
                <h2>{gameMode === 'category' ? category : 'Random'} Quiz</h2>
                <div className="score">Score: {score}</div>
            </div>

            <div className="question-card">
                {question && (
                    <>
                        <div className="question-info">
                            <span className="category">{question.category || 'Unknown Category'}</span>
                            <span className="difficulty">{question.difficulty || 'Normal'}</span>
                            {gameMode === 'category' && (
                                <span className="progress">
                                    Question {currentQuestionIndex + 1} of {questions.length}
                                </span>
                            )}
                        </div>

                        <div className="question-content">
                            <h3>{question.text || 'Question text not available'}</h3>
                            <div className="options">
                                {Array.isArray(question.options) && question.options.map((option, index) => (
                                    <button
                                        key={index}
                                        className={`option-btn ${selectedAnswer === index ? 'selected' : ''} 
                                            ${result && selectedAnswer === index ? 
                                                (result.correct ? 'correct' : 'incorrect') : ''}`}
                                        onClick={() => handleAnswerSelect(index)}
                                        disabled={selectedAnswer !== null}
                                    >
                                        {option || `Option ${index + 1}`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {result && (
                            <div className="result-section">
                                <p className={result.correct ? 'correct-answer' : 'incorrect-answer'}>
                                    {result.correct ? 'Correct!' : 'Incorrect!'} 
                                    {result.correct && <span> +{result.points || 0} points</span>}
                                </p>
                                <button 
                                    className="btn-primary next-question" 
                                    onClick={handleNextQuestion}
                                >
                                    Next Question
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default PlayGame;