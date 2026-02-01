const express = require('express');
const db = require('./db');
const auth = require('./authMiddleware');

const router = express.Router();

// Get all expenses for user
router.get('/', auth, (req, res) => {
    db.all(
        'SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC',
        [req.user.id],
        (err, rows) => {
            if (err) return res.status(500).json({ message: 'Error fetching expenses'});
            res.json(rows);
        }
    );
});

//Create expense
router.post('/', auth, (req, res) => {
    const {amount, category, date, note} = req.body;
    const stmt = `
        INSERT INTO expenses (user_id, amount, category, date, note)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(stmt, [req.user.id, amount, category, date, note], function(err) {
        if(err) return res.status(500).json({ message:'Error creating expense'});
        res.json({id:this.lastID, user_id:req.user.id, amount, category, date, note});
    });

});

//Update expense
router.put('/id', auth, (req, res) => {
    const {amount, category, date, note} =req.body;
    const stmt = `
        UPDATE expenses
        SET amount = ?. category = ?, date =? , note = ?
        WHERE id = ? AND user_id = ?
    `;
    db.run(stmt, [amount, category, date, note, req.params.id, req.user.id], function (err) {
        if(err) return res.status(500).json({ message: `Error updating expense`});
        res.json({message: 'Updated'});

});
     });

//Delete expense
router.delete('/id', auth, (req, res) => {
    db.run(
        `DELETE FROM expenses WHERE id = ? AND user_id = ?`,
        [req.params.id, req.user.id],
        function (err) {
            if(err) return res.status(500).json({message: 'Error deleting expense'});
            res.json({message: 'Deleted'});
        }

    );
});
        
module.exports = router;

