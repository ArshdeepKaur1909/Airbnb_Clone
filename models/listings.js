const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingsSchema = new Schema({
   title: {
    type: String,
    required: true
   },
   description: String,
   image: {
    type: String,
    // This default URL is used to set as img URL when no URL is passed or basically value of image key is undefined
    default: "https://images.unsplash.com/photo-1529316275402-0462fcc4abd6?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // This set parameter is used as image's validation because in case when we are getting an empty string from user as image URL through this we will set a default URL
    set: (v) => v === ""
                ? "https://images.unsplash.com/photo-1529316275402-0462fcc4abd6?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                : v
   },
   price: Number,
   location: String,
   country: String,
});

const Listing = mongoose.model("Listing", listingsSchema);

module.exports = Listing;