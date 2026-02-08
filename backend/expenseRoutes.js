const express = require('express');
const db = require('./db');
const auth = require('./authMiddleware');

const router = express.Router();

// ------------------------------
// GET ALL EXPENSES
// ------------------------------
router.get('/', auth, (req, res) => {
  const userId = req.user.id;

  db.all(
    `SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'Error fetching expenses' });
      res.json(rows);
    }
  );
});

// ------------------------------
// MONTHLY SUMMARY
// ------------------------------
router.get('/summary/month/:month', auth, (req, res) => {
  const userId = req.user.id;
  const month = req.params.month;

  db.get(
    `
    SELECT SUM(amount) AS total
    FROM expenses
    WHERE user_id = ?
      AND strftime('%Y-%m', date) = ?
    `,
    [userId, month],
    (err, row) => {
      if (err) return res.status(500).json({ message: 'Error fetching total' });

      const total = row?.total || 0;

      db.all(
        `
        SELECT category, SUM(amount) AS total
        FROM expenses
        WHERE user_id = ?
          AND strftime('%Y-%m', date) = ?
        GROUP BY category
        `,
        [userId, month],
        (err, rows) => {
          if (err) return res.status(500).json({ message: 'Error fetching categories' });

          res.json({
            total,
            byCategory: rows || []
          });
        }
      );
    }
  );
});

// ------------------------------
// CREATE EXPENSE
// ------------------------------
router.post('/', auth, (req, res) => {
  const { amount, category, date, note } = req.body;

  const stmt = `
    INSERT INTO expenses (user_id, amount, category, date, note)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(stmt, [req.user.id, amount, category, date, note], function (err) {
    if (err) return res.status(500).json({ message: 'Error creating expense' });

    res.json({
      id: this.lastID,
      user_id: req.user.id,
      amount,
      category,
      date,
      note
    });
  });
});

// ------------------------------
// UPDATE EXPENSE
// ------------------------------
router.put('/:id', auth, (req, res) => {
  const { amount, category, date, note } = req.body;
  const userId = req.user.id;
  const expenseId = req.params.id;

  const stmt = `
    UPDATE expenses
    SET amount = ?, category = ?, date = ?, note = ?
    WHERE id = ? AND user_id = ?
  `;

  db.run(stmt, [amount, category, date, note, expenseId, userId], function (err) {
    if (err) return res.status(500).json({ message: 'Error updating expense' });

    res.json({ updated: this.changes });
  });
});

// ------------------------------
// DELETE EXPENSE
// ------------------------------
router.delete('/:id', auth, (req, res) => {
  const userId = req.user.id;
  const expenseId = req.params.id;

  db.run(
    `DELETE FROM expenses WHERE id = ? AND user_id = ?`,
    [expenseId, userId],
    function (err) {
      if (err) return res.status(500).json({ message: 'Error deleting expense' });

      res.json({ deleted: this.changes });
    }
  );
});

module.exports = router;
