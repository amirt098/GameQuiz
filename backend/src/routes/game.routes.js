const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Submit answer for a question
router.post('/questions/:id/answer', auth, async (req, res) => {
    try {
        const { answer } = req.body;
        const questionId = req.params.id;

        // Get question details
        const questionStmt = db.prepare('SELECT * FROM questions WHERE id = ?');
        const question = questionStmt.get(questionId);

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        const isCorrect = answer === question.correct_answer;
        const pointsEarned = isCorrect ? question.points : 0;

        // Save user's answer
        const answerStmt = db.prepare(`
            INSERT INTO user_answers (
                user_id, question_id, selected_answer, 
                is_correct, points_earned
            ) VALUES (?, ?, ?, ?, ?)
        `);
        answerStmt.run(
            req.user.id,
            questionId,
            answer,
            isCorrect ? 1 : 0,
            pointsEarned
        );

        // Update user's points if answer is correct
        if (isCorrect) {
            const updatePointsStmt = db.prepare(`
                UPDATE users 
                SET points = points + ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `);
            updatePointsStmt.run(pointsEarned, req.user.id);
        }

        res.json({
            success: true,
            result: {
                correct: isCorrect,
                points: pointsEarned,
                correctAnswer: question.correct_answer
            }
        });
    } catch (error) {
        console.error('Error submitting answer:', error);
        res.status(500).json({ error: 'Error submitting answer' });
    }
});

// Get user's answer history
router.get('/history', auth, async (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT 
                ua.id as answer_id,
                ua.selected_answer,
                ua.is_correct,
                ua.points_earned,
                ua.answered_at,
                q.id as question_id,
                q.title,
                q.question,
                q.options,
                q.correct_answer,
                q.category,
                q.difficulty
            FROM user_answers ua
            JOIN questions q ON ua.question_id = q.id
            WHERE ua.user_id = ?
            ORDER BY ua.answered_at DESC
        `);
        const history = stmt.all(req.user.id);

        res.json(history);
    } catch (error) {
        console.error('Error fetching answer history:', error);
        res.status(500).json({ error: 'Error fetching answer history' });
    }
});

// Get leaderboard
router.get('/leaderboard', auth, async (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT 
                id,
                name,
                points,
                role
            FROM users
            ORDER BY points DESC
            LIMIT 10
        `);
        const leaderboard = stmt.all();

        res.json(leaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: 'Error fetching leaderboard' });
    }
});

// Get random question for playing
router.get('/random', auth, async (req, res) => {
    try {
        const { category, difficulty } = req.query;
        let query = `
            SELECT * FROM questions 
            WHERE status = 'active'
        `;
        const params = [];

        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }
        if (difficulty) {
            query += ' AND difficulty = ?';
            params.push(difficulty);
        }

        query += ' ORDER BY RANDOM() LIMIT 1';
        
        const stmt = db.prepare(query);
        const question = stmt.get(...params);

        if (!question) {
            return res.status(404).json({ error: 'No questions found with given criteria' });
        }

        // Don't send correct answer to client
        const { correct_answer, ...questionWithoutAnswer } = question;
        res.json(questionWithoutAnswer);
    } catch (error) {
        console.error('Error fetching random question:', error);
        res.status(500).json({ error: 'Error fetching random question' });
    }
});

module.exports = router;
