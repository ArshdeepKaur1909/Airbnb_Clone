const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); // This package in npm is used to create common layouts that can be used in different ejs pages
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

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

// REQUEST FOR LISTING DOWN ALL LOCATIONS IN DATABASE
app.get("/listings", wrapAsync(async (req, res) => {
  const Listings = await Listing.find();
  res.render("listings/index.ejs", {Listings});
}));


// REQUEST FOR PROVIDING A FORM FOR ADDING NEW LOCATION
app.get("/listings/new", function(req, res){ 
  res.render("listings/addForm.ejs");
});

// REQUEST FOR ADDING NEW LOCATION IN DATABASE AND REDIRECTING AFTER THIS 
app.post("/listings", wrapAsync(async (req, res) => {
  if( !req.body ){
  // if request body not present with request --> this is error from client-side
   return next(new ExpressError(400, "Error from client-side"));
  }
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

// REQUEST FOR SHOWING PARTICULAR LISTING DETAIL ON CLICKING IT
app.get("/listings/:id", wrapAsync(async (req, res) => {
  const {id: Id} = req.params;
  const listing = await Listing.findById(Id.toString());
  res.render("listings/show.ejs", { listing });
}));

// REQUEST FOR PROVIDING FORM FOR EDITING LISTING DETAILS
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let { id: Id } = req.params;
  const listing = await Listing.findById(Id.toString());
  res.render("listings/editForm.ejs", { listing }); 
}));

// REQUEST FOR REDIRECTING TO SHOW.EJS PAGE AFTER EDITING
app.put("/listings/:id", wrapAsync(async (req, res) => {
  const {id: Id} = req.params;
  const listing = await Listing.findByIdAndUpdate(Id, req.body.listing);
  res.redirect("/listings");
}));

// REQUEST FOR DELETING A PARTICULAR LOCATION
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  const {id: Id} = req.params;
  await Listing.findByIdAndDelete(Id);
  res.redirect("/listings");
}));

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