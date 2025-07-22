const User = require("../models/user.js");

module.exports.signupForm = (req, res) => {
  res.render("users/signUp.ejs");
};
module.exports.signup =  async (req,res) => {
  try{
    const { username, email, password } = req.body.user;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if(err){
        next(err);
      }
    req.flash("success", "User is registered successfully");
    res.redirect("/listings");  
    }); // This function of req w.r.t. passport library automatically logins user on website as soon as user sign-up
  }catch(e){
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};
module.exports.loginForm = (req, res) => {
  res.render("users/loginIn.ejs");
};
module.exports.login = async (req, res) => {
  req.flash("success", "Welcome Back to Airbnb");
  req.session.redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(req.session.redirectUrl);
};
module.exports.logout = (req, res) => {
  req.logout( (err) => {
    if(err){
      next(err);
    }else{
      req.flash("error", "Oops! you logout");
      res.redirect("/listings");
    }
  } ); // req.logout() is used to logout the user from current session and in parenthesis we define callback that needs to be immediately implemented just after user is logout

};