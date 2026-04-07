const requireRole = (roles) => {
  return (req, res, next) => {
    // req.user populated by auth middleware
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient role permissions' });
    }
    next();
  };
};

module.exports = { requireRole };
