import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const isNeon = process.env.DB_HOST?.includes(".neon.tech");

// PostgreSQL database connection configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'webshop',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT ? 
        Number.parseInt(process.env.DB_PORT) 
        : 5432,

    // Neon requires an encrypted SSL connection.
  ssl: isNeon ? true : false,

  // Neon supports secure channel binding.
  enableChannelBinding: isNeon,
  
});

// Handle unexpected database errors 
pool.on('error', (err) => {
  console.error(' Unerwarteter Fehler bei der Datenbankverbindung:', err);
  process.exit(1);
});

export default pool;