const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({ 
    comment: String,
    rating : {
        type: String,
        min: 1,
        max: 5
    },
    created_at: {
        type: Date,
        default: new Date().toDateString(),
    }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;