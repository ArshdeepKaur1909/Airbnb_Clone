const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
.get(userController.signupForm)  // Route for sending out form when user wants to sign-up
.post(wrapAsync( userController.signup )); //Route for saving user data in database and redirecting to listings page

router.route("/login")
.get(userController.loginForm) //Route for providing a form to Login
.post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),  wrapAsync( userController.login )); // For passport.authenticate middleware to work your form fields name must be like username, password not like user[username], user[password]

//Route for to logout the user as soon as this request comes
router.get("/logout", userController.logout);

module.exports = router;