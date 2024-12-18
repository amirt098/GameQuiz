const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Get all categories
router.get('/', auth, async (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM categories ORDER BY name');
        const categories = stmt.all();
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Error fetching categories' });
    }
});

// Create new category
router.post('/', auth, async (req, res) => {
    try {
        const { name } = req.body;

        // Check if category already exists
        const checkStmt = db.prepare('SELECT id FROM categories WHERE name = ?');
        const existingCategory = checkStmt.get(name);

        if (existingCategory) {
            return res.status(400).json({ error: 'Category already exists' });
        }

        const stmt = db.prepare('INSERT INTO categories (name) VALUES (?)');
        const result = stmt.run(name);

        res.status(201).json({
            success: true,
            category: {
                id: result.lastInsertRowid,
                name
            }
        });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Error creating category' });
    }
});

// Update category
router.put('/:id', auth, async (req, res) => {
    try {
        const { name } = req.body;

        // Check if category exists
        const checkStmt = db.prepare('SELECT id FROM categories WHERE id = ?');
        const category = checkStmt.get(req.params.id);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Check if new name already exists
        const nameCheckStmt = db.prepare('SELECT id FROM categories WHERE name = ? AND id != ?');
        const existingCategory = nameCheckStmt.get(name, req.params.id);

        if (existingCategory) {
            return res.status(400).json({ error: 'Category name already exists' });
        }

        const stmt = db.prepare('UPDATE categories SET name = ? WHERE id = ?');
        stmt.run(name, req.params.id);

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Error updating category' });
    }
});

// Delete category
router.delete('/:id', auth, async (req, res) => {
    try {
        // Check if category exists
        const checkStmt = db.prepare('SELECT id FROM categories WHERE id = ?');
        const category = checkStmt.get(req.params.id);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Check if category is being used by any questions
        const questionCheckStmt = db.prepare('SELECT COUNT(*) as count FROM questions WHERE category = ?');
        const { count } = questionCheckStmt.get(category.name);

        if (count > 0) {
            return res.status(400).json({ error: 'Cannot delete category that is being used by questions' });
        }

        const stmt = db.prepare('DELETE FROM categories WHERE id = ?');
        stmt.run(req.params.id);

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Error deleting category' });
    }
});

module.exports = router;
