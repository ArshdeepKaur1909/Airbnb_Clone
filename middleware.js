const LoggedIn = (req, res, next) => {
  if( !req.isAuthenticated() ){  // console.log(req.user); req.user stores logined user info w.r.t. each session in form of cookies
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Must be logged in first");
    res.redirect("/login");
  }else{
    next();
  }
}

//Creating and exporting function saveRedirectUrl such that it stores request route's originalUrl upon whose response LoggedIn function gets triggered
const saveRedirectUrl = (req, res, next) => {
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl; 
  }
  next();
}

module.exports = { LoggedIn,  saveRedirectUrl };