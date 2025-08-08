//Any web-development project works on 3 aspects i.e. MVC = Models, Views, Controllers
//Controllers = This folder holds files handling executing backend part of each request

const Listing = require("../models/listings.js");

module.exports.index = async (req, res) => {
  const Listings = await Listing.find();
  res.render("listings/index.ejs", {Listings});
};

module.exports.new = function(req, res){ 
  res.render("listings/addForm.ejs");
};

module.exports.add = async (req, res) => {
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
  newListing.owner = req.user._id;
  newListing.image.url = req.file.path;
  newListing.image.filename = req.file.filename;
  await newListing.save();
  req.flash("success", "New Listing is created!");
  res.redirect("/listings");
  console.log(req.body);
};

module.exports.show = async (req, res) => {
  const {id: Id} = req.params;
  const listing = await Listing.findById(Id).populate({path: "reviews", populate: { path: "author" }}).populate("owner");
  if(!listing){
    req.flash("error", "Listing is not found!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.edit = async (req, res) => {
  let { id: Id } = req.params;
  const listing = await Listing.findById(Id.toString());
  if(!listing){
    req.flash("error", "Listing is not found!");
    return res.redirect("/listings");
  }
  res.render("listings/editForm.ejs", { listing }); 
};

module.exports.editAndShow = async (req, res) => {
  const {id: Id} = req.params;
  const updatedData = {...req.body.listing};
  if(req.file){
  updatedData.image = updatedData.image || {};

  const url = req.file.path;
  const filename = req.file.filename;
  updatedData.image.url = url;
  updatedData.image.filename = filename;
  };
  await Listing.findByIdAndUpdate(Id, updatedData);
  req.flash("success", "Edited Successfully");
  res.redirect(`/listings/${Id}`);
};

module.exports.destroy = async (req, res) => {
  const {id: Id} = req.params;
  await Listing.findByIdAndDelete(Id);
  req.flash("success", "Listing is deleted successfully");
  res.redirect("/listings");
};