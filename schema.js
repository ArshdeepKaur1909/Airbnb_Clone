// USING JOI HERE IN ORDER TO HANDLE SCHEMA VALIDATION ERROR WHEN NEW ENTRY WILL BE ADDED IN LISTINGS
const Joi = require("joi");

// SCHEMA DEFINED FOR UPCOMING DATA FOR GETTING STORED IN LISTING COLLECTION
module.exports.listingsSchema = Joi.object({
 listing: Joi.object({
     title: Joi.string().required(),
     description: Joi.string().required(),
     image: Joi.string().allow("", null),
     price: Joi.number().required().min(0), // price should be number and non-negative
     country: Joi.string().required(),
     location: Joi.string().required(),
 }).required()
});

// SCHEMA DEFINED FOR UPCOMING DATA FOR GETTING STORED IN REVIEW COLLECTION
module.exports.reviewsSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5),
    }).required()
});

