const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); // This package in npm is used to create common layouts that can be used in different ejs pages
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/users.js");

main()
.then( (result) => {
  console.log(`Result of executing main function is ${result}`);
} )
.catch( (error) => {
  console.log(`Error of executing main function is ${error}`)
} )

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/airBnb');
}

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

const sessionOptions = {
  secret: "mytopsecret",
  resave: false,
  saveUninitialized: true,
  cookie: {  // this cookie key shows cookie associated with a particular session that will be storing session's information on browser
     expires: Date.now() + 7*24*60*60*1000, // Time after which stored data in cookie will get delete --> here I want to delete it after 1 week of date on which its created
     maxAge: 7*24*60*60*1000, // Time upto which data in cookie will be holding
     httpOnly: true,
  }
}

app.use(session( sessionOptions )); //Middleware for handling sessions on website
app.use(flash());
app.use( (req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  next();
});
app.use(passport.initialize()); // Middleware is used to initialize passport
app.use(passport.session()); // Middleware to identify user as it browses from page to page and doesn't needs to login again & again for each page
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.get("/demoUser", async (req, res) => {
  const newUser = new User({
    email: "demouser234@gmail.com",
    username: "Demo User"
  });
  let user = await User.register(newUser, "helloUser"); // static method to register a new user instance with a given password. Also, Checks if username is unique --> Syntax: register(user, password, cb)
  res.send(user);
});

// MIDDLEWARE FOR HANDLING RANDOM REQUESTS ON SERVER
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// ERROR HANDLING MIDDLEWARE
app.use( (err, req, res, next) => {
  const {statusCode = 500, message = "Error Occured"} = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
    console.log("Started Listening At port 8080");
});