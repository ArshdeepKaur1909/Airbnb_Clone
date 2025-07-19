const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listings.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingsSchema } = require("../schema.js");
const { LoggedIn } = require("../middleware.js");

// CREATING A MIDDLEWARE FOR HANDLING LISTING'S SCHEMA VALIDATION
const validateListing = (req, res, next) => {
  const { error } = listingsSchema.validate(req.body);
  console.log(listingsSchema.validate(req.body));
  if( error ){
    throw new ExpressError(400, error);
  }
  next();
};

// REQUEST FOR LISTING DOWN ALL LOCATIONS IN DATABASE
router.get("/", wrapAsync(async (req, res) => {
  const Listings = await Listing.find();
  res.render("listings/index.ejs", {Listings});
}));


// REQUEST FOR PROVIDING A FORM FOR ADDING NEW LOCATION
router.get("/new",  LoggedIn, function(req, res){ 
  res.render("listings/addForm.ejs");
});

// REQUEST FOR ADDING NEW LOCATION IN DATABASE AND REDIRECTING AFTER THIS 
router.post("/", validateListing, wrapAsync(async (req, res) => {
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
  req.flash("success", "New Listing is created!");
  res.redirect("/listings");
}));

// REQUEST FOR SHOWING PARTICULAR LISTING DETAIL ON CLICKING IT
router.get("/:id", wrapAsync(async (req, res) => {
  const {id: Id} = req.params;
  const listing = await Listing.findById(Id).populate("reviews");
  if(!listing){
    req.flash("error", "Listing is not found!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
}));

// REQUEST FOR PROVIDING FORM FOR EDITING LISTING DETAILS
router.get("/:id/edit", LoggedIn, wrapAsync(async (req, res) => {
  let { id: Id } = req.params;
  const listing = await Listing.findById(Id.toString());
  if(!listing){
    req.flash("error", "Listing is not found!");
    return res.redirect("/listings");
  }
  res.render("listings/editForm.ejs", { listing }); 
}));

// REQUEST FOR REDIRECTING TO SHOW.EJS PAGE AFTER EDITING
router.put("/:id", wrapAsync(async (req, res) => {
  const {id: Id} = req.params;
  const listing = await Listing.findByIdAndUpdate(Id, req.body.listing);
  req.flash("success", "Edited Successfully");
  res.redirect(`/listings/${Id}`);
}));

// REQUEST FOR DELETING A PARTICULAR LOCATION
router.delete("/:id", LoggedIn, wrapAsync(async (req, res) => {
  const {id: Id} = req.params;
  await Listing.findByIdAndDelete(Id);
  req.flash("success", "Listing is deleted successfully");
  res.redirect("/listings");
}));

module.exports = router;