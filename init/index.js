const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");

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

const addData = async function(){
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("Data is added in Listing collection");
}

addData();


