import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    getRandomUnansweredQuestion,
    getQuestionsByCategory,
    submitAnswer,
    getCategories,
    getUserAnsweredQuestions,
    saveUserAnswer
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import '../css/PlayerHome.css';

const PlayerHome = () => {
    const [gameState, setGameState] = useState('selection');
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const { user } = useAuth();
    const { darkMode } = useTheme();


    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                setError('');

                const categoriesResponse = await getCategories();
                if (categoriesResponse?.status === 200 && categoriesResponse.data) {
                    const categoryList = Array.isArray(categoriesResponse.data) ?
                        categoriesResponse.data :
                        (categoriesResponse.data.categories || []);

                    setCategories(categoryList.map(cat => typeof cat === 'object' ? cat.name : cat));
                } else {
                    setCategories([]);
                    console.warn('No categories available');
                }

                if (user?.id) {
                    const answersResponse = await getUserAnsweredQuestions(user.id);
                    console.log(answersResponse);
                    if (answersResponse?.status === 200) {
                        updateAnsweredQuestions(answersResponse);
                    } else {
                        setAnsweredQuestions([]);
                        console.warn('No answered questions available');
                    }
                }
            } catch (err) {
                console.error('Error fetching initial data:', err);
                setError('Failed to load game data. Please try again.');
                setCategories([]);
                setAnsweredQuestions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [user?.id]);

    const startGame = async (mode, category = null) => {
        setLoading(true);
        setError('');
        setCurrentQuestion(null);
        setSelectedAnswer(null);
        setResult(null);

        try {
            let response;
            if (mode === 'random') {
                response = await getRandomUnansweredQuestion(user.id);
                if (response?.status === 200) {
                    if (!response.data) {
                        throw new Error('You have answered all available questions! Try a different category or wait for new questions.');
                    }
                    setCurrentQuestion(response.data);
                    setGameState('playing');
                } else {
                    throw new Error(response?.error || 'No questions available');
                }
            } else if (category) {
                response = await getQuestionsByCategory(category);
                if (response?.status === 200) {
                    const questions = Array.isArray(response.data) ? response.data :
                                   (response.data?.questions || []);

                    const unansweredQuestions = questions.filter(q =>
                        q && q.options && !answeredQuestions.some(aq => aq.questionId === q.id)
                    );

                    if (unansweredQuestions.length > 0) {
                        const randomQuestion = unansweredQuestions[Math.floor(Math.random() * unansweredQuestions.length)];
                        setCurrentQuestion(randomQuestion);
                        setGameState('playing');
                    } else {
                        throw new Error('You have answered all questions in this category! Try a different category.');
                    }
                } else {
                    throw new Error(response?.error || 'Failed to load questions');
                }
            }
        } catch (err) {
            console.error('Error starting game:', err);
            setError(err.message || 'Failed to start game. Please try again.');
            setGameState('selection'); // Return to selection screen on error
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = async (option) => {
        if (selectedAnswer || !currentQuestion || !user?.id) return;

        setSelectedAnswer(option);
        try {
            setLoading(true);
            console.log('Submitting answer for question:', currentQuestion.id, 'Answer:', option);
            const response = await submitAnswer(currentQuestion.id, option);
            console.log('Submit answer response:', response);

            if (response.status === 200 && response.data) {
                const isCorrect = response.data.correct;
                const points = response.data.points || 0;

                console.log('Saving user answer:', {
                    userId: user.id,
                    questionId: currentQuestion.id,
                    answer: option,
                    isCorrect,
                    points
                });

                await saveUserAnswer(user.id, currentQuestion.id, option, isCorrect, points);

                setResult({
                    correct: isCorrect,
                    points: points,
                    correctAnswer: response.data.correctAnswer
                });


            } else {
                throw new Error(response.error || 'Failed to submit answer');
            }
        } catch (err) {
            console.error('Error in handleAnswerSelect:', err);
            setError(err.message || 'Failed to submit answer. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleNextQuestion = () => {
        if (gameState === 'playing' && result) {
            startGame('random'); // Always get a random question for "Next Question"
        }
    };

    const updateAnsweredQuestions = (data) => {
        const formattedAnswers = data.map(answer => ({
            id: answer.id,
            question: {
                id: answer.question.id,
                title: answer.question.title,
                text: answer.question.text,
                category: answer.question.category,
                points: answer.question.points,
                correctAnswer: answer.question.correctAnswer,
            },
            selectedAnswer: answer.selectedAnswer,
            correct: answer.correct,
            answeredAt: answer.answeredAt,
        }));

        console.log('Formatted answers:', formattedAnswers); // Log formatted answers
        setAnsweredQuestions(formattedAnswers);
    };

    const renderAnswerHistory = () => {
        return (
            <div className="history-section">
                <h3>Your Answer History</h3>
                <div className="history-list">
                    {answeredQuestions.map((answer) => (
                        <div key={answer.id} className={`history-item ${answer.correct ? 'correct' : 'incorrect'}`}>
                            <div className="history-meta">
                            <span className="history-date">
                                {new Date(answer.answeredAt).toLocaleDateString()}
                            </span>
                                <span className="history-category">
                                Category: {answer.question.category}
                            </span>
                                <span className={`history-result ${answer.correct ? 'correct' : 'incorrect'}`}>
                                {answer.correct ? '✓ Correct' : '✗ Incorrect'}
                            </span>
                                <span className="history-points">
                                Points: {answer.question.points}
                            </span>
                            </div>
                            <div className="question-details">
                                <h4>{answer.question.title}</h4>
                                <p className="question-text">{answer.question.text}</p>
                            </div>
                            <div className="answer-details">
                                <div className="history-answer">
                                    <span className="answer-label">Your Answer:</span>
                                    <span className="answer-text">{answer.selectedAnswer}</span>
                                </div>
                                <div className="history-answer">
                                    <span className="answer-label">Correct Answer:</span>
                                    <span className="answer-text">{answer.question.correctAnswer}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {answeredQuestions.length === 0 && (
                        <div className="no-history">
                            No questions answered yet. Start playing to see your history!
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderGameContent = () => {
        if (loading) {
            return <div className="loading">Loading...</div>;
        }

        if (error) {
            return <div className="error">{error}</div>;
        }

        if (gameState === 'playing' && currentQuestion) {
            return (
                <div className={`question-container ${darkMode ? 'dark' : 'light'}`}>
                    <div className="question-header">
                        <div className="question-meta">
                            <span className="category">{currentQuestion.category}</span>
                            <span className="difficulty">{currentQuestion.difficulty}</span>
                            <span className="points">Points: {currentQuestion.points}</span>
                        </div>
                    </div>

                    <div className="question-content">
                        <h3>{currentQuestion.title}</h3>
                        <p className="question-text">{currentQuestion.text}</p>

                        <div className="options-grid">
                            {currentQuestion.options.map((option, index) => (
                                <button
                                    key={index}
                                    className={`option ${selectedAnswer === option ? 'selected' : ''} 
                                              ${result && option === result.correctAnswer ? 'correct' : ''}
                                              ${result && selectedAnswer === option && option !== result.correctAnswer ? 'incorrect' : ''}`}
                                    onClick={() => handleAnswerSelect(option)}
                                    disabled={selectedAnswer !== null}
                                >
                                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                                    <span className="option-text">{option}</span>
                                </button>
                            ))}
                        </div>

                        {result && (
                            <div className={`result ${result.correct ? 'correct' : 'incorrect'}`}>
                                <p className="result-text">
                                    {result.correct ? ' Correct!' : ' Incorrect!'}
                                </p>
                                <p className="points-text">
                                    {result.correct ? `+${currentQuestion.points} points!` : 'Try again!'}
                                </p>
                            </div>
                        )}

                        <div className="action-buttons">
                            <button
                                className="next-button"
                                onClick={() => setGameState('selection')}
                            >
                                Back to Categories
                            </button>
                            {result && (
                                <button
                                    className="next-button primary"
                                    onClick={handleNextQuestion}
                                >
                                    Next Question
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <>
                <h2>Welcome to Game Quiz!</h2>
                <div className="game-controls">
                    <button
                        className={`history-toggle-button ${showHistory ? 'active' : ''}`}
                        onClick={() => setShowHistory(!showHistory)}
                        aria-label="Toggle History"
                    >
                        <span className="button-content">
                            <i className="fas fa-history"></i>
                            <span className="button-text">Game History</span>
                            <span className="history-count">{answeredQuestions.length}</span>
                        </span>
                    </button>
                </div>

                {showHistory ? (
                    renderAnswerHistory()
                ) : (
                    <div className="game-selection">
                        <div className="random-play-section">
                            <button
                                className="mode-button random"
                                onClick={() => startGame('random')}
                            >
                                <span className="icon">🎲</span>
                                Play Random Question
                            </button>
                        </div>

                        <div className="categories-section">
                            <h3>Select a Category</h3>
                            <div className="category-grid">
                                {categories.map((category, index) => (
                                    <button
                                        key={index}
                                        className="category-button"
                                        onClick={() => startGame('category', category)}
                                    >
                                        <span className="category-icon">📚</span>
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    };

    return (
        <div className={`player-home ${darkMode ? 'dark' : 'light'}`}>
            {renderGameContent()}
        </div>
    );
};

export default PlayerHome;
