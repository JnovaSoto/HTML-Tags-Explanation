import express from 'express';
import db from '../db/database.js';

const router = express.Router();

// Crear tag
router.post('/', (req, res) => {
  const { tagName, usability, content } = req.body;
  if (!tagName) return res.status(400).json({ error: 'tagName es obligatorio' });

  const sql = `INSERT INTO tags (tagName, usability, content) VALUES (?, ?, ?)`;
  db.run(sql, [tagName, usability, content], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, tagName, usability, content });
  });
});

// Obtener todos
router.get('/', (req, res) => {
  db.all(`SELECT * FROM tags`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

export default router;
