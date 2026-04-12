const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log("HEADERS RECEIVED:", req.headers);

  // Public routes skip
  if (req.path === '/' || req.path === '/health' || req.path.startsWith('/auth')) {
    return next();
  }

  // Check header first
  if (req.headers['x-org-id']) {
    req.org_id = req.headers['x-org-id'];
    return next();
  }

  // JWT fallback
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

    if (!req.user) req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token inside tenant checks' });
  }
};