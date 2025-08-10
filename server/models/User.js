import { query } from '../config/database.js';
import bcrypt from 'bcryptjs';

export class User {
  static async create({ username, email, password }) {
    try {
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const result = await query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, email, hashedPassword]
    );
    
    return result.rows[0];
    } catch (error) {
      if (error.message === 'Database not connected') {
        throw new Error('Database connection required. Please connect to Supabase.');
      }
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    return result.rows[0];
    } catch (error) {
      if (error.message === 'Database not connected') {
        throw new Error('Database connection required. Please connect to Supabase.');
      }
      throw error;
    }
  }

  static async findById(id) {
    try {
    const result = await query(
      'SELECT id, username, email, created_at, total_games, best_score FROM users WHERE id = $1',
      [id]
    );
    
    return result.rows[0];
    } catch (error) {
      if (error.message === 'Database not connected') {
        throw new Error('Database connection required. Please connect to Supabase.');
      }
      throw error;
    }
  }

  static async updateStats(userId, score, gameWon = false) {
    try {
    await query(
      `UPDATE users 
       SET total_games = total_games + 1,
           best_score = GREATEST(best_score, $2),
           games_won = games_won + $3
       WHERE id = $1`,
      [userId, score, gameWon ? 1 : 0]
    );
    } catch (error) {
      if (error.message === 'Database not connected') {
        console.warn('Could not update user stats - database not connected');
        return;
      }
      throw error;
    }
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}