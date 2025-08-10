import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Use Supabase connection string if available, otherwise fallback to local
const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

if (!connectionString) {
  console.error('No database connection string found. Please set DATABASE_URL or connect to Supabase.');
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export const connectDB = async () => {
  try {
    if (!connectionString) {
      console.log('Database connection skipped - no connection string available');
      return;
    }
    const client = await pool.connect();
    console.log('Database connected successfully');
    client.release();
  } catch (error) {
    console.error('Database connection error:', error);
    console.log('Continuing without database connection...');
  }
};

export const query = async (text, params) => {
  if (!connectionString) {
    throw new Error('Database not connected');
  }
  return pool.query(text, params);
};

export default pool;