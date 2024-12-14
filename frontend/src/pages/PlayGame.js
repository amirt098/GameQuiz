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
    const [score, setScore] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const loadQuestions = async () => {
        setLoading(true);
        try {
            if (gameMode === 'category' && category) {
                const categoryQuestions = await getQuestionsByCategory(category);
                setQuestions(categoryQuestions);
                setQuestion(categoryQuestions[0]);
            } else {
                const randomQuestion = await getRandomQuestion();
                setQuestion(randomQuestion);
            }
        } catch (error) {
            console.error('Error loading questions:', error);
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
        if (selectedAnswer !== null || loading) return;
        
        setSelectedAnswer(answerIndex);
        try {
            const response = await submitAnswer(question.id, answerIndex);
            setResult(response);
            if (response.correct) {
                setScore(prevScore => prevScore + response.points);
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
        }
    };

    const handleNextQuestion = async () => {
        if (gameMode === 'category') {
            if (currentQuestionIndex + 1 < questions.length) {
                setCurrentQuestionIndex(prev => prev + 1);
                setQuestion(questions[currentQuestionIndex + 1]);
                setSelectedAnswer(null);
                setResult(null);
            } else {
                // End of category questions
                navigate('/', { 
                    state: { 
                        completedCategory: category,
                        finalScore: score 
                    }
                });
            }
        } else {
            await loadQuestions();
        }
    };

    if (loading) {
        return <div className="play-game">Loading...</div>;
    }

    return (
        <div className="play-game">
            <div className="game-header">
                <h2>{gameMode === 'category' ? category : 'Random'} Quiz</h2>
                <div className="score">Score: {score}</div>
            </div>

            <div className="question-card">
                <div className="question-info">
                    <span className="category">{question.category}</span>
                    <span className="difficulty">{question.difficulty}</span>
                    {gameMode === 'category' && (
                        <span className="progress">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </span>
                    )}
                </div>
                
                <h3>{question.question}</h3>

                <div className="options">
                    {question.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            className={`option ${
                                selectedAnswer === index 
                                    ? result 
                                        ? result.correct ? 'correct' : 'incorrect'
                                        : 'selected'
                                    : ''
                            }`}
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
                            {gameMode === 'category' && currentQuestionIndex + 1 === questions.length 
                                ? 'Finish Quiz' 
                                : 'Next Question'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlayGame;