require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Initialize database
require('./config/db');

const authRoutes = require('./routes/auth.routes');
const questionRoutes = require('./routes/question.routes');
const categoryRoutes = require('./routes/category.routes');
const gameRoutes = require('./routes/game.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/game', gameRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
