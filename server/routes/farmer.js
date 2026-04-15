const express = require('express');
const db = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);
router.use(authorize('farmer'));

// View their own entries
router.get('/entries', (req, res) => {
    try {
        const entries = db.prepare("SELECT * FROM milk_entries WHERE farmer_int_id = ? ORDER BY date DESC").all(req.user.id);
        res.json(entries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Overall stats
router.get('/stats', (req, res) => {
    try {
        const totalMilk = db.prepare("SELECT SUM(litres) as total FROM milk_entries WHERE farmer_int_id = ?").get(req.user.id).total || 0;
        const totalEarnings = db.prepare("SELECT SUM(amount) as total FROM milk_entries WHERE farmer_int_id = ?").get(req.user.id).total || 0;
        const pendingPayments = db.prepare("SELECT SUM(amount) as total FROM milk_entries WHERE farmer_int_id = ? AND payment_status = 'pending'").get(req.user.id).total || 0;
        
        res.json({ totalMilk, totalEarnings, pendingPayments });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
