exports.allowRoles = (...roles) => (req, res, next) => {
  if (!req.auth || !roles.includes(req.auth.role))
    return res.status(403).json({ message: "You do not have permission for this action." });
  next();
};
