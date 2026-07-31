import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// PostgreSQL adatbázis kapcsolat pool létrehozása
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'webshop',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});

// Sikeres kapcsolódás visszajelzése
pool.on('connect', () => {
  console.log(' Datenbankverbindung erfolgreich hergestellt.');
});

// Adatbázis hiba kezelése
pool.on('error', (err) => {
  console.error(' Unerwarteter Fehler bei der Datenbankverbindung:', err);
  process.exit(-1);
});

export default {
  query: (text, params) => pool.query(text, params),
  pool,
};

export { pool };