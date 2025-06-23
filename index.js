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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded(( {extended: true} )));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

app.get("/listings", async (req, res) => {
  const Listings = await Listing.find();
  res.render("listings/index.ejs", {Listings});
});

app.get("/listings/add", function(req, res){ 
  res.render("listings/addForm.ejs");
});

app.listen(8080, () => {
    console.log("Started Listening At port 8080");
});