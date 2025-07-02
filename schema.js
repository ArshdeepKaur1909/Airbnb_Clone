// USING JOI HERE IN ORDER TO HANDLE SCHEMA VALIDATION ERROR WHEN NEW ENTRY WILL BE ADDED IN LISTINGS
const Joi = require("joi");

module.exports.listingsSchema = Joi.object({
 listing: Joi.object({
     title: Joi.string().required(),
     description: Joi.string().required(),
     image: Joi.string().allow("", null),
     price: Joi.number().required().min(0), // price should be number and non-negative
     location: Joi.string().required(),
 }).required()
});