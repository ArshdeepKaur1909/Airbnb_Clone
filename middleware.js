const LoggedIn = (req, res, next) => {
  console.log(req.user); // req.user stores logined user info w.r.t. each session in form of cookies
  if( !req.isAuthenticated() ){
    req.flash("error", "Must be logged in first");
    res.redirect("/login");
  }
  next();
}

module.exports = LoggedIn;