const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); // This package in npm is used to create common layouts that can be used in different ejs pages
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");

const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");

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

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

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