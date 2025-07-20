const Listing = require("./models/listings.js");
const Review = require("./models/review.js");

const LoggedIn = (req, res, next) => {
  if( !req.isAuthenticated() ){  // console.log(req.user); req.user stores logined user info w.r.t. each session in form of cookies
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Must be logged in first");
    res.redirect("/login");
  }else{
    next();
  }
}

//Creating and exporting function saveRedirectUrl such that it stores request route's originalUrl upon whose response LoggedIn function gets triggered
const saveRedirectUrl = (req, res, next) => {
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl; 
  }
  next();
}

//Creating Middleware function in order to check user editing listing is creator of listing or not
const isOwner = async (req, res, next) => {
  const {id: Id} = req.params;
  const listing = await Listing.findById(Id);
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error", "Not Allowed for editing this listing");
    res.redirect(`/listings/${Id}`);
  }else{ next(); }
};

//Creating Middleware function in order to check user deleting review is its actual user
const isAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);  
  if( !review.author._id.equals(res.locals.currUser._id) ){
    req.flash("error", "Cannot delete this review");
    res.redirect(`/listings/${id}`);
  }else{
    next();
  }
};

module.exports = { LoggedIn,  saveRedirectUrl, isOwner, isAuthor};