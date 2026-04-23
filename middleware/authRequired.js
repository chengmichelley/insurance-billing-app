const authRequired = (req, res, next)=> {
  if(req.session.user) {
    next();
  } else {
    res.session.returnTo = req.originalUrl;
    res.redirect('/auth/sign-in');
  }
};

module.exports = authRequired