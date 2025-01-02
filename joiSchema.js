const Joi = require('joi');

const joiSchema = Joi.object({
    title: Joi.string()
            .required(),
    description: Joi.string()
            .required(),
    image: Joi.string()
            .allow(' ', null),
    price: Joi.number()
            .min(0)
            .required(),
    location: Joi.string()
            .required(),
    country: Joi.string()
            .required()
})

module.exports  = {joiSchema}