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
}).required();

const reviewJoiSchema = Joi.object({
        remarks:Joi.string().required(),
        rating:Joi.number().required().min(1).max(5).default(3)
});

module.exports  = {joiSchema, reviewJoiSchema}