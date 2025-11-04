import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Error al conectar SQLite:', err.message);
  else console.log('Conectado a SQLite');
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tagName TEXT NOT NULL,
      usability TEXT,
      content TEXT
    )
  `);
});

export default db;
