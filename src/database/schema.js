const Joi = require('joi');

const schema = Joi.object({
  name: Joi.string()
    .min(4)
    .max(20)
    .required(),
  title: Joi.string()
    .min(4)
    .max(20)
    .required(),
});

module.exports = schema;