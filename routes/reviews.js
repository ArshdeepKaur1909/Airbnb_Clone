const express = require("express");
const router = express.Router({ mergeParams: true }); // In router we set { mergeParams: true } so that req.params don't settle in index.js only
const Listing = require("../models/listings.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewsSchema } = require("../schema.js");
const { isAuthor } = require("../middleware.js");

// CREATING A MIDDLEWARE FOR HANDLING REVIEW'S SCHEMA VALIDATION
const validateReview = (req, res, next) => {
  const { error } = reviewsSchema.validate(req.body);
  if( error ){
    throw new ExpressError(400, error);
  }
  next();
}

// REQUEST FOR HANDLING REVIEWS FOR A PARTICULAR LISTING
router.post("/", validateReview, wrapAsync( async (req, res) => {
  let { id: Id } = req.params;
  const listing = await Listing.findById(Id);
  const review = new Review(req.body.review);
  review.author = req.user._id;

  listing.reviews.push(review._id);

  await review.save();
  await listing.save();
  
  req.flash("success", "Review is added successfully");
  res.redirect(`/listings/${listing._id}`);
}));

// REQUEST FOR DELETION OF REVIEW ASSOCIATED WITH THAT DELETE BUTTON
router.delete("/:reviewId", isAuthor, wrapAsync( async (req, res) => {
  const {id: Id1, reviewId: Id2} = req.params;
  await Listing.findByIdAndUpdate(Id1, { $pull: { reviews: Id2 } });
  await Review.findByIdAndDelete(Id2);

  req.flash("success", "Review is deleted successfully");
  res.redirect(`/listings/${Id1}`);
}));

module.exports = router;