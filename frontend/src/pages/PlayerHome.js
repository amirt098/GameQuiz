import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    getRandomQuestion, 
    getQuestionsByCategory, 
    submitAnswer, 
    getCategories,
    getUserAnsweredQuestions,
    saveUserAnswer 
} from '../services/api';
import '../css/PlayerHome.css';

const PlayerHome = () => {
    const [gameState, setGameState] = useState('selection'); // 'selection', 'playing', 'history'
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const mockUserId = "user123"; // This would normally come from authentication

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [availableCategories, userAnswers] = await Promise.all([
                    getCategories(),
                    getUserAnsweredQuestions(mockUserId)
                ]);
                setCategories(availableCategories);
                setAnsweredQuestions(userAnswers);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching initial data:', error);
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const startGame = async (mode, category = null) => {
        setLoading(true);
        try {
            let question;
            if (mode === 'random') {
                question = await getRandomQuestion();
            } else {
                const categoryQuestions = await getQuestionsByCategory(category);
                question = categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)];
            }
            setCurrentQuestion(question);
            setGameState('playing');
            setSelectedAnswer(null);
            setResult(null);
        } catch (error) {
            console.error('Error starting game:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSubmit = async (answerIndex) => {
        if (selectedAnswer !== null || loading) return;
        
        setSelectedAnswer(answerIndex);
        try {
            const response = await submitAnswer(currentQuestion.id, answerIndex);
            setResult(response);
            
            // Save the answer to user's history
            await saveUserAnswer(
                mockUserId,
                currentQuestion.id,
                answerIndex,
                response.correct,
                response.points
            );
            
            // Update answered questions list
            const updatedAnswers = await getUserAnsweredQuestions(mockUserId);
            setAnsweredQuestions(updatedAnswers);
        } catch (error) {
            console.error('Error submitting answer:', error);
        }
    };

    const handleNextQuestion = () => {
        setGameState('selection');
        setCurrentQuestion(null);
        setSelectedAnswer(null);
        setResult(null);
    };

    if (loading) {
        return <div className="player-home">Loading...</div>;
    }

    if (gameState === 'history') {
        return (
            <div className="player-home">
                <h2>Your Question History</h2>
                <div className="history-list">
                    {answeredQuestions.map((question, index) => (
                        <div key={index} className={`history-item ${question.isCorrect ? 'correct' : 'incorrect'}`}>
                            <h3>{question.title}</h3>
                            <p className="question-text">{question.question}</p>
                            <div className="answer-info">
                                <p>Your answer: {question.options[question.selectedAnswer]}</p>
                                <p>Correct answer: {question.options[question.correctAnswer]}</p>
                                <p>Points earned: {question.earnedPoints}</p>
                                <p>Category: {question.category}</p>
                                <p>Answered on: {new Date(question.answeredAt).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => setGameState('selection')} className="back-button">
                    Back to Game Selection
                </button>
            </div>
        );
    }

    if (gameState === 'playing' && currentQuestion) {
        return (
            <div className="player-home">
                <div className="question-card">
                    <div className="question-info">
                        <span className="category">{currentQuestion.category}</span>
                        <span className="difficulty">{currentQuestion.difficulty}</span>
                    </div>
                    
                    <h3>{currentQuestion.question}</h3>

                    <div className="options">
                        {currentQuestion.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSubmit(index)}
                                className={`option ${selectedAnswer === index ? result ? result.correct ? 'correct' : 'incorrect' : 'selected' : ''}`}
                                disabled={selectedAnswer !== null}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    {result && (
                        <div className={`result ${result.correct ? 'correct' : 'incorrect'}`}>
                            <p>{result.correct ? 'Correct! +' + result.points + ' points' : 'Incorrect!'}</p>
                            {!result.correct && <p>{result.explanation}</p>}
                            <button onClick={handleNextQuestion} className="next-button">
                                Try Another Question
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="player-home">
            <h1>Welcome, Player</h1>
            <div className="links">
                <div 
                    onClick={() => setGameState('history')} 
                    className="history-card"
                >
                    <h3>View History</h3>
                    <p>Check your past questions and answers</p>
                </div>
            </div>
            <h2>Choose your game mode:</h2>
            
            <div className="game-modes">
                <button 
                    className="mode-button random"
                    onClick={() => startGame('random')}
                >
                    <span className="icon">🎲</span>
                    Random Question
                </button>

                <div className="category-buttons">
                    {categories.map((category) => (
                        <button
                            key={category}
                            className="mode-button category"
                            onClick={() => startGame('category', category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlayerHome;
