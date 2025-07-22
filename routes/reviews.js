const express = require("express");
const router = express.Router({ mergeParams: true }); // In router we set { mergeParams: true } so that req.params don't settle in index.js only
const Listing = require("../models/listings.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewsSchema } = require("../schema.js");
const { isAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// CREATING A MIDDLEWARE FOR HANDLING REVIEW'S SCHEMA VALIDATION
const validateReview = (req, res, next) => {
  const { error } = reviewsSchema.validate(req.body);
  if( error ){
    throw new ExpressError(400, error);
  }
  next();
}

// REQUEST FOR HANDLING REVIEWS FOR A PARTICULAR LISTING
router.post("/", validateReview, wrapAsync(reviewController.addReview));

// REQUEST FOR DELETION OF REVIEW ASSOCIATED WITH THAT DELETE BUTTON
router.delete("/:reviewId", isAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;