const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

function auth(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({message: 'No token'});

    const token = header.split('')[1]
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    } catch {
        return res.status(401).json({message: 'Invalid token'});
    }
}

module.exports = auth;