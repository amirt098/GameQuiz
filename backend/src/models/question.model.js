const db = require('../config/db');

class Question {
  static create({ title, question, options, correctAnswer, category, difficulty, points, createdBy }) {
    const stmt = db.prepare(`
      INSERT INTO questions (
        title, question, options, correct_answer, 
        category, difficulty, points, created_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      title,
      question,
      JSON.stringify(options),
      correctAnswer,
      category,
      difficulty,
      points,
      createdBy
    );

    return result.lastInsertRowid;
  }

  static findById(id) {
    const stmt = db.prepare('SELECT * FROM questions WHERE id = ?');
    const question = stmt.get(id);
    if (question) {
      question.options = JSON.parse(question.options);
    }
    return question;
  }

  static findByCategory(category) {
    const stmt = db.prepare('SELECT * FROM questions WHERE category = ?');
    const questions = stmt.all(category);
    return questions.map(q => ({ ...q, options: JSON.parse(q.options) }));
  }

  static getAll({ difficulty, category } = {}) {
    let query = 'SELECT * FROM questions';
    const params = [];

    if (difficulty || category) {
      query += ' WHERE';
      if (difficulty) {
        query += ' difficulty = ?';
        params.push(difficulty);
      }
      if (category) {
        if (difficulty) query += ' AND';
        query += ' category = ?';
        params.push(category);
      }
    }

    const stmt = db.prepare(query);
    const questions = stmt.all(...params);
    return questions.map(q => ({ ...q, options: JSON.parse(q.options) }));
  }

  static getRandomQuestion() {
    const stmt = db.prepare('SELECT * FROM questions ORDER BY RANDOM() LIMIT 1');
    const question = stmt.get();
    if (question) {
      question.options = JSON.parse(question.options);
    }
    return question;
  }

  static delete(id) {
    const stmt = db.prepare('DELETE FROM questions WHERE id = ?');
    return stmt.run(id);
  }
}

module.exports = Question;
