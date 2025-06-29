const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate"); // This package in npm is used to create common layouts that can be used in different ejs pages
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");

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
app.use(express.urlencoded(( {extended: true} )));
app.use(express.static(path.join(__dirname, "public")));

// REQUEST FOR LISTING DOWN ALL LOCATIONS IN DATABASE
app.get("/listings", async (req, res) => {
  const Listings = await Listing.find();
  res.render("listings/index.ejs", {Listings});
});

// REQUEST FOR PROVIDING A FORM FOR ADDING NEW LOCATION
app.get("/listings/new", function(req, res){ 
  res.render("listings/addForm.ejs");
});

// REQUEST FOR SHOWING PARTICULAR LISTING DETAIL ON CLICKING IT
app.get("/listing/:id", async (req, res) => {
  const {id: Id} = req.params;
  const listing = await Listing.findById(Id.toString());
  res.render("listings/show.ejs", { listing });
});

app.listen(8080, () => {
    console.log("Started Listening At port 8080");
});