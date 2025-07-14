const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// In userSchema, we will be defining schema for user's email because Passport-Local Mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value  
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);