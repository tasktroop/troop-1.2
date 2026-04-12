module.exports = (req, res, next) => {
  console.log("HEADERS RECEIVED:", req.headers);

  // normalize all possible header formats
  const orgId =
    req.headers['x-org-id'] ||
    req.headers['x_org_id'] ||
    req.headers['xorgid'] ||
    req.headers['org_id'];

  if (req.path === '/' || req.path === '/health' || req.path.startsWith('/auth')) {
    return next();
  }

  if (orgId) {
    req.org_id = orgId;
    return next();
  }

  return res.status(401).json({
    error: "Unauthorized: Missing org_id token context"
  });
};