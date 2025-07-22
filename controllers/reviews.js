const Listing = require("../models/listings.js");
const Review = require("../models/review.js");

module.exports.addReview = async (req, res) => {
  let { id: Id } = req.params;
  const listing = await Listing.findById(Id);
  const review = new Review(req.body.review);
  review.author = req.user._id;

  listing.reviews.push(review._id);

  await review.save();
  await listing.save();
  
  req.flash("success", "Review is added successfully");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const {id: Id1, reviewId: Id2} = req.params;
  await Listing.findByIdAndUpdate(Id1, { $pull: { reviews: Id2 } });
  await Review.findByIdAndDelete(Id2);

  req.flash("success", "Review is deleted successfully");
  res.redirect(`/listings/${Id1}`);
};