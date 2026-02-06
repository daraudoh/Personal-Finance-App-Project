const express = require('express');
const bcrypt =require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

//Register
router.post('/register', (req,res) => {
    const { name, email, password} = req.body;
    console.log("Register route hit:", req.body)
    console.log("DB file path:", db.filename);

    if (!email || !password) return res.status(400).json({message: 'Email and password required'});

    const password_hash = bcrypt.hashSync(password, 10);

    const stmt = `INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)`;
    db.run(stmt, [name, email, password_hash], function (err) {
        if (err) {
            console.log("Registration error", err)
            return res.status(400).json({message: 'Registration failed'});
        }

        console.log("User inserted with ID", this.lastID);
        res.json({id: this.lastID, name, email});

        
    });

});

//Login
router.post('/login', (req, res) => {
    const {email, password} = req.body;

    db.get(`SELECT * FROM users WHERE email =?`, [email], (err, user) => {
        if(err || !user) return res.status(400).json({message: 'Invalid credentials'});

        const valid = bcrypt.compareSync(password, user.password_hash);
        if (!valid) return res.status(400).json({message: 'Invalid credential'});

        const token = jwt.sign({id:user.id, email: user.email}, JWT_SECRET, {expiresIn: '7d'});
        res.json({token});
    });

});

module.exports = router;
