/*router.get('/summary/month/:month', auth, (req, res) => {
    const month = req.params.month; //format: '2026-02'
    const likePattern = `${month}%`;

    const totalQuery = `
        SELECT SUM(amount) as total 
        FROM expenses 
        WHERE user_id = ? AND date LIKE ?
    `;

    const categoryQuery = `
        SELECT category, SUM(amount) as total
        FROM expenses
        WHERE user_id = ? AND date LIKE ?
        GROUP BY category
    `;

    db.get(totalQuery, [req.user.id, likePattern], (err, totalRow) => {
        if(err) return res.status(500).json({ message: 'Error' });

        db.all(categoryQuery, [req.user.id, likePattern], (err2, catRows) => {
            if(err2) return res.status(500).json({ message: 'Error'});

            res.json({
                total: totalRow?.total || 0,
                byCategory: catRows || []
            });
        });
    });
});*/

router.get('/dashboard', (req, res) => {
    const userId = req.user.id;

    const summary = {};
    
    db.get(
        'SELECT SUM(amount) AS total FROM expenses WHERE user_id =?',
        [userId],
        (err, row) => {
            summary.total = row?.total || 0;

            db.all(
                `SELECT category, SUM(amount) AS total
                FROM expenses
                WHERE user_id = ?
                GROUP BY category`,

                [userId],
                (err, rows) => {
                    summary.byCategory = rows || [];

                    db.all(
                        `SELECT * FROM expenses
                        WHERE user_id = ?
                        ORDER BY date DESC
                        LIMIT 5`
                        [userId],
                        (err, recent) => {
                            summary.recent = recent || [];
                            res.json(summary);
                        }
                    );
                }
                
            );
        }

    );
});