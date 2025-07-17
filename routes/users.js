const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");

// Route for sending out form when user wants to sign-up
router.get("/signup", (req, res) => {
  res.render("users/signUp.ejs");
});

//Route for saving user data in database and redirecting to listings page
router.post("/signup", wrapAsync( async (req,res) => {
  try{
    const { username, email, password } = req.body.user;
    const newUser = new User({email, username});
    await User.register(newUser, password);
    req.flash("success", "User is registered successfully");
    res.redirect("/listings");
  }catch(e){
    req.flash("error", e.message);
    res.redirect("/signup");
  }
} ));

//Route for providing a form to Login
router.get("/login", (req, res) => {
  res.render("users/loginIn.ejs");
});

// For passport.authenticate middleware to work your form fields name must be like username, password not like user[username], user[password]
router.post("/login", passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),  wrapAsync( async (req, res) => {
  req.flash("success", "Welcome Back to Airbnb");
  res.redirect("/listings");
}));

//Route for to logout the user as soon as this request comes
router.get("/logout", (req, res) => {
  req.logout( (err) => {
    if(err){
      next(err);
    }else{
      req.flash("error", "Oops! you logout");
      res.redirect("/listings");
    }
  } ); // req.logout() is used to logout the user from current session and in parenthesis we define callback that needs to be immediately implemented just after user is logout

});

module.exports = router;