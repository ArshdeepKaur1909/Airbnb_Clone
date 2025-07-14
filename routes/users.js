const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

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

module.exports = router;