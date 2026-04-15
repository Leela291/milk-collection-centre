const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply middleware to all routes in this file
router.use(authenticate);
router.use(authorize('admin'));

// Generate a padded ID like '01', '02', '03'
const generateFarmerId = () => {
    const countQuery = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'farmer'").get();
    let nextNum = countQuery.count + 1;
    let found = false;
    let newId;
    while (!found) {
        newId = nextNum.toString().padStart(2, '0');
        const existing = db.prepare("SELECT id FROM users WHERE farmer_id = ?").get(newId);
        if (!existing) {
            found = true;
        } else {
            nextNum++;
        }
    }
    return newId;
};

// --- Farmer Management ---

// List all farmers
router.get('/farmers', (req, res) => {
    try {
        const farmers = db.prepare("SELECT id, farmer_id, name, contact FROM users WHERE role = 'farmer'").all();
        res.json(farmers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add new farmer
router.post('/farmers', (req, res) => {
    const { name, contact, password } = req.body;
    try {
        const farmer_id = generateFarmerId();
        const hash = bcrypt.hashSync(password || 'password123', 10);
        
        const stmt = db.prepare("INSERT INTO users (farmer_id, password_hash, name, contact, role) VALUES (?, ?, ?, ?, 'farmer')");
        const info = stmt.run(farmer_id, hash, name, contact);
        
        res.json({ id: info.lastInsertRowid, farmer_id, name, contact });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Milk Entries Management ---

function getPriceForFat(fat) {
    const table = [
        { f: 5.0, p: 35 },
        { f: 6.0, p: 46 },
        { f: 7.0, p: 54 },
        { f: 8.0, p: 61 },
        { f: 9.0, p: 69 },
        { f: 10.0, p: 77 }
    ];
    if (fat <= 5.0) return 35;
    if (fat >= 10.0) return 77;
    
    for (let i = 0; i < table.length - 1; i++) {
        const low = table[i];
        const high = table[i+1];
        if (fat >= low.f && fat <= high.f) {
            const fraction = (fat - low.f) / (high.f - low.f);
            return low.p + fraction * (high.p - low.p);
        }
    }
    return 35;
}

// Add Entry
router.post('/entries', (req, res) => {
    const { farmer_int_id, date, litres, fat } = req.body;
    try {
        const pricePerLitre = getPriceForFat(parseFloat(fat));
        const amount = parseFloat(litres) * pricePerLitre;
        
        const stmt = db.prepare("INSERT INTO milk_entries (farmer_int_id, date, litres, fat, amount) VALUES (?, ?, ?, ?, ?)");
        const info = stmt.run(farmer_int_id, date, litres, fat, amount);
        
        res.json({ id: info.lastInsertRowid, farmer_int_id, date, litres, fat, amount, payment_status: 'pending' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// List all entries (for Dashboard)
router.get('/entries', (req, res) => {
    try {
        const entries = db.prepare(`
            SELECT m.*, u.name, u.farmer_id 
            FROM milk_entries m 
            JOIN users u ON m.farmer_int_id = u.id 
            ORDER BY m.date DESC
        `).all();
        res.json(entries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mark entries as Paid
router.put('/entries/pay', (req, res) => {
    const { entryIds } = req.body; // Array of IDs
    if (!entryIds || !entryIds.length) return res.status(400).json({ error: 'No IDs provided' });
    
    try {
        const placeholders = entryIds.map(() => '?').join(',');
        const stmt = db.prepare(`UPDATE milk_entries SET payment_status = 'paid' WHERE id IN (${placeholders})`);
        stmt.run(...entryIds);
        res.json({ message: 'Marked as paid' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Dashboard Stats
router.get('/stats', (req, res) => {
    try {
        const totalFarmers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'farmer'").get().count;
        const totalMilk = db.prepare("SELECT SUM(litres) as total FROM milk_entries").get().total || 0;
        const totalPayments = db.prepare("SELECT SUM(amount) as total FROM milk_entries WHERE payment_status = 'paid'").get().total || 0;
        const pendingPayments = db.prepare("SELECT SUM(amount) as total FROM milk_entries WHERE payment_status = 'pending'").get().total || 0;
        
        res.json({ totalFarmers, totalMilk, totalPayments, pendingPayments });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
