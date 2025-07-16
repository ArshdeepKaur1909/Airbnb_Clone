const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("users/signUp.ejs");
});

router.post("/signup", wrapAsync( async (req,res) => {
  try{
    const { username, email, password } = new User(req.body.user);
    const newUser = new User({email, username});
    await User.register(newUser, password);
    req.flash("success", "User is registered successfully");
    res.redirect("/listings");
  }catch(e){
    req.flash("error", e.message);
    res.redirect("/signup");
  }
} ));

router.get("/login", (req, res) => {
  res.render("users/loginIn.ejs");
});

router.post("/login", passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),  wrapAsync( async (req, res) => {
  req.flash("success", "Welcome Back to Airbnb");
  req.redirect("/listings");
}));

module.exports = router;