const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listings.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingsSchema } = require("../schema.js");
const { LoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js"); // accessed file having functions handling backend part of each request on "/listings" path

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
router.get("/", wrapAsync(listingController.index));


// REQUEST FOR PROVIDING A FORM FOR ADDING NEW LOCATION
router.get("/new",  LoggedIn, listingController.new);

// REQUEST FOR ADDING NEW LOCATION IN DATABASE AND REDIRECTING AFTER THIS 
router.post("/", validateListing, wrapAsync(listingController.add));

// REQUEST FOR SHOWING PARTICULAR LISTING DETAIL ON CLICKING IT
router.get("/:id", wrapAsync(listingController.show));

// REQUEST FOR PROVIDING FORM FOR EDITING LISTING DETAILS
router.get("/:id/edit", LoggedIn, wrapAsync(listingController.edit));

// REQUEST FOR REDIRECTING TO SHOW.EJS PAGE AFTER EDITING
router.put("/:id", isOwner, wrapAsync(listingController.editAndShow));

// REQUEST FOR DELETING A PARTICULAR LOCATION
router.delete("/:id", LoggedIn, wrapAsync(listingController.destroy));

module.exports = router;