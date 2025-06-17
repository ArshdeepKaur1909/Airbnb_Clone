const express = require("express");
const app = express();
const mongoose = require("mongoose");

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

app.listen(8080, () => {
    console.log("Started Listening At port 8080");
});