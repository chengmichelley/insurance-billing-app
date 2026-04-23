const isAdmin = (req, res, next)=> {
  if(req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.redirect('/patients/search?error=Admin required to access')
};

module.exports = isAdmin;