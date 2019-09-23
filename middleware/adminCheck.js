module.exports = (req, res, next) => {
  const user = req.user;
  if (user.type === 0) {
    return next(Error('该用户没有操作权限！'), 401);
  }
  next();
}