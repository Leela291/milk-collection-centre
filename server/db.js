const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.resolve(process.env.DATA_DIR || __dirname, 'database.sqlite');
const db = new Database(dbPath, { verbose: console.log });

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_id TEXT UNIQUE,
    password_hash TEXT,
    name TEXT,
    contact TEXT,
    role TEXT
  );

  CREATE TABLE IF NOT EXISTS milk_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_int_id INTEGER,
    date TEXT,
    litres REAL,
    fat REAL,
    amount REAL,
    payment_status TEXT DEFAULT 'pending',
    FOREIGN KEY(farmer_int_id) REFERENCES users(id)
  );
`);

// Insert default Admin if none exists
const admin = db.prepare('SELECT * FROM users WHERE role = ?').get('admin');
if (!admin) {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (farmer_id, password_hash, name, role) VALUES (?, ?, ?, ?)').run('admin', hash, 'Administrator', 'admin');
}

module.exports = db;
