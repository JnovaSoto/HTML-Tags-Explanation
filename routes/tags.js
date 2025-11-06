import express from 'express';
import db from '../db/database.js';

const router = express.Router();

// Create tag
router.post('/', (req, res) => {
  //Body for the post petition
  const { tagName, usability, content } = req.body;
  //Checking if it is empty
  if (!tagName) return res.status(400).json({ error: 'tagName es obligatorio' });

  //SQL Script to create the new tag
  const sql = `INSERT INTO tags (tagName, usability, content) VALUES (?, ?, ?)`;
  //Make the petition and send the body
  db.run(sql, [tagName, usability, content], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, tagName, usability, content });
  });
});

// Get tags
router.get('/', (req, res) => {

  //SQL Script to get all the tags
  db.all(`SELECT * FROM tags`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

//Export the router
export default router;
