const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing org_id token context' });
    }
    
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_dev');
        if (!decoded.org_id) {
            return res.status(400).json({ error: 'Bad Request: Missing org_id in token' });
        }
        req.org_id = decoded.org_id;
        
        // Ensure req.user is populated if auth middleware wasn't called
        if (!req.user) req.user = decoded;
        
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token inside tenant checks' });
    }
};
