import express from 'express';
import bcrypt from "bcrypt";
import validator from "validator";
import db from '../db/database.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// -------------------------------
// Create a new user
// -------------------------------
router.post('/user', async (req, res) => {
  const { username, email, password, admin } = req.body;

  const saltRounds = 10;

  // Hash password
  const hash = await bcrypt.hash(password, saltRounds);
  console.log("Hash = " + hash);

  console.log('Inserting user:', username, email, admin ? "Admin" : "User");

  // Validate input
  if (!username || !email || admin == null || !hash) {
    return res.status(400).json({ error: 'All the attributes must be complete' });
  }

  if (!validator.isEmail(email)) return res.status(400).json({ error: "Invalid email" });

  if (username.length > 20) return res.status(400).json({ error: 'Username too long' });
  if (email.length > 40) return res.status(400).json({ error: 'Email too long' });
  if (password.length < 8) return res.status(400).json({ error: 'Password too short' });

  // Insert user into DB
  const sql = `INSERT INTO users (username, email, password, admin) VALUES (?, ?, ?, ?)`;
  db.run(sql, [username, email, hash, admin], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, username, email });
  });
});

// -------------------------------
// Log In user (username or email)
// -------------------------------
router.post('/login', (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) return res.status(400).json({ error: 'All the inputs have to be fulled' });

  // Find user by username OR email
  const sql = `SELECT * FROM users WHERE username = ? OR email = ?`;
  db.get(sql, [login, login], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'User or password are incorrect' });

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'User or password are incorrect' });

    // Save session
    req.session.userId = user.id;
    req.session.username = user.username;

    res.json({ message: 'Successfully Login', userId: user.id, username: user.username, admin: user.admin });
  });
});

// -------------------------------
// Get user by ID
// -------------------------------
router.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  console.log("Getting the user with the id = " + id);

  if (isNaN(id)) return res.status(400).json({ error: 'Invalid user ID' });

  const sql = `SELECT * FROM users WHERE ID = ?`;
  db.get(sql, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'User not found' });
    res.json(row);
  });
});

export default router;
