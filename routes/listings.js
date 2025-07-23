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

//router.route is used to pair up response routes based upon their request path
router.route("/")
.get( wrapAsync(listingController.index) ) // REQUEST FOR LISTING DOWN ALL LOCATIONS IN DATABASE
.post( validateListing, wrapAsync(listingController.add) ) // REQUEST FOR ADDING NEW LOCATION IN DATABASE AND REDIRECTING AFTER THIS 

// REQUEST FOR PROVIDING A FORM FOR ADDING NEW LOCATION
router.get("/new",  LoggedIn, listingController.new);

router.route("/:id")
.get( wrapAsync(listingController.show) ) // REQUEST FOR SHOWING PARTICULAR LISTING DETAIL ON CLICKING IT
.put( isOwner, wrapAsync(listingController.editAndShow) ) // REQUEST FOR REDIRECTING TO SHOW.EJS PAGE AFTER EDITING
.delete( LoggedIn, wrapAsync(listingController.destroy) ) // REQUEST FOR DELETING A PARTICULAR LOCATION

// REQUEST FOR PROVIDING FORM FOR EDITING LISTING DETAILS
router.get("/:id/edit", LoggedIn, wrapAsync(listingController.edit));

module.exports = router;