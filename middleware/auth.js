// Middleware to check if user is logged in
export function isAuthenticated(req, res, next) { 
  if (req.session.userId) return next();
  res.status(401).json({ message: 'No autorizado' });
}
