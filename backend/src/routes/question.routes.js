const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Get all questions with filters
router.get('/', auth, async (req, res) => {
    try {
        const { category, difficulty, status, designer } = req.query;
        let query = 'SELECT * FROM questions WHERE 1=1';
        const params = [];

        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }
        if (difficulty) {
            query += ' AND difficulty = ?';
            params.push(difficulty);
        }
        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }
        if (designer) {
            query += ' AND designer_id = ?';
            params.push(designer);
        }

        const stmt = db.prepare(query);
        const questions = stmt.all(...params);

        res.json({ questions, total: questions.length });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Error fetching questions' });
    }
});

// Create new question
router.post('/', auth, async (req, res) => {
    try {
        const { title, question, options, correctAnswer, category, difficulty, points } = req.body;
        
        const stmt = db.prepare(`
            INSERT INTO questions (
                title, question, options, correct_answer, 
                category, difficulty, points, designer_id, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            title,
            question,
            JSON.stringify(options),
            correctAnswer,
            category,
            difficulty,
            points,
            req.user.id,
            'pending'
        );

        res.status(201).json({
            success: true,
            question: {
                id: result.lastInsertRowid,
                title,
                question,
                options,
                correctAnswer,
                category,
                difficulty,
                points,
                designerId: req.user.id,
                status: 'pending'
            }
        });
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ error: 'Error creating question' });
    }
});

// Get question by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM questions WHERE id = ?');
        const question = stmt.get(req.params.id);

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        res.json(question);
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({ error: 'Error fetching question' });
    }
});

// Update question
router.put('/:id', auth, async (req, res) => {
    try {
        const { title, question, options, correctAnswer, category, difficulty, points, status } = req.body;
        
        // Check if question exists and user is authorized
        const checkStmt = db.prepare('SELECT designer_id FROM questions WHERE id = ?');
        const existingQuestion = checkStmt.get(req.params.id);

        if (!existingQuestion) {
            return res.status(404).json({ error: 'Question not found' });
        }

        if (existingQuestion.designer_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to update this question' });
        }

        const stmt = db.prepare(`
            UPDATE questions 
            SET title = ?, question = ?, options = ?, correct_answer = ?,
                category = ?, difficulty = ?, points = ?, status = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);

        stmt.run(
            title,
            question,
            JSON.stringify(options),
            correctAnswer,
            category,
            difficulty,
            points,
            status,
            req.params.id
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ error: 'Error updating question' });
    }
});

// Delete question
router.delete('/:id', auth, async (req, res) => {
    try {
        // Check if question exists and user is authorized
        const checkStmt = db.prepare('SELECT designer_id FROM questions WHERE id = ?');
        const question = checkStmt.get(req.params.id);

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        if (question.designer_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to delete this question' });
        }

        const stmt = db.prepare('DELETE FROM questions WHERE id = ?');
        stmt.run(req.params.id);

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ error: 'Error deleting question' });
    }
});

module.exports = router;
