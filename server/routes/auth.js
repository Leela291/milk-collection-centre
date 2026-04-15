const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

router.post('/login', (req, res) => {
  const { farmer_id, password } = req.body;

  try {
    const user = db.prepare('SELECT * FROM users WHERE farmer_id = ?').get(farmer_id);

    if (!user) {
      return res.status(401).json({ error: 'Invalid ID or password' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid ID or password' });
    }

    const token = jwt.sign(
      { id: user.id, farmer_id: user.farmer_id, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, farmer_id: user.farmer_id, role: user.role, name: user.name } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
