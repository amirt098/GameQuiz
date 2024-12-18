const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async create({ email, password, name, role = 'player' }) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const stmt = db.prepare(`
        INSERT INTO users (email, password, name, role)
        VALUES (?, ?, ?, ?)
      `);
      const result = stmt.run(email, hashedPassword, name, role);
      return result.lastInsertRowid;
    } catch (error) {
      throw error;
    }
  }

  static findByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  }

  static findById(id) {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  }

  static async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  static updatePoints(userId, points) {
    const stmt = db.prepare(`
      UPDATE users 
      SET points = points + ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    return stmt.run(points, userId);
  }

  static getLeaderboard(limit = 10) {
    const stmt = db.prepare(`
      SELECT id, name, points 
      FROM users 
      ORDER BY points DESC 
      LIMIT ?
    `);
    return stmt.all(limit);
  }
}

module.exports = User;
