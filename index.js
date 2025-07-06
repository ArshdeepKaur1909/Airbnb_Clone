const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); // This package in npm is used to create common layouts that can be used in different ejs pages
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");
const Review = require("./models/review.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingsSchema, reviewsSchema } = require("./schema.js");

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

// CREATING A MIDDLEWARE FOR HANDLING LISTING'S SCHEMA VALIDATION
const validateListing = (req, res, next) => {
  const { error } = listingsSchema.validate(req.body);
  console.log(listingsSchema.validate(req.body));
  if( error ){
    throw new ExpressError(400, error);
  }
};

// CREATING A MIDDLEWARE FOR HANDLING REVIEW'S SCHEMA VALIDATION
const validateReview = (req, res, next) => {
  const { error } = reviewsSchema.validate(req.body);
  if( error ){
    throw new ExpressError(400, error);
  }
}

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
app.post("/listings", validateListing, wrapAsync(async (req, res) => {
  // no need of this as we are passing a middleware handling schema validation errors
  // const result = listingsSchema.validate(req.body);
  // if( result.error ){
  //   throw new ExpressError(400, result.error);
  // }

  // if( !req.body ){
  // // if request body not present with request --> this is error from client-side
  //   throw new ExpressError(400, "Error from client-side");
  // }
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

// REQUEST FOR SHOWING PARTICULAR LISTING DETAIL ON CLICKING IT
app.get("/listings/:id", wrapAsync(async (req, res) => {
  const {id: Id} = req.params;
  const listing = await Listing.findById(Id).populate("reviews");
  console.log(listing);
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
  res.redirect(`/listings/${Id}`);
}));

// REQUEST FOR DELETING A PARTICULAR LOCATION
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  const {id: Id} = req.params;
  await Listing.findByIdAndDelete(Id);
  res.redirect("/listings");
}));

// REQUEST FOR HANDLING REVIEWS FOR A PARTICULAR LISTING
app.post("/listings/:id/reviews", validateReview, wrapAsync( async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const review = new Review(req.body.review);

  listing.reviews.push(review._id);

  await review.save();
  await listing.save();

  console.log(review);

  res.redirect(`/listings/${listing._id}`);
}));

// REQUEST FOR DELETION OF REVIEW ASSOCIATED WITH THAT DELETE BUTTON
app.delete("/listings/:id/reviews/:reviewId", wrapAsync( async (req, res) => {
  const {id: Id1, reviewId: Id2} = req.params;
  await Listing.findByIdAndUpdate(Id1, { $pull: { reviews: Id2 } });
  await Review.findByIdAndDelete(Id2);

  res.redirect(`/listings/${Id1}`);
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