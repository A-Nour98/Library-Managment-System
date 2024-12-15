const Joi = require('joi');

const createValidation = (request) => {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .email()
      .messages({
        'string.empty': 'Email is required.',
      }),
    name: Joi.string()
      .required()
      .messages({
        'string.empty': 'Name is required.',
      })
  });

  return schema.validate(request, { abortEarly: false }); 
};


const updateValidation = (request) => {
  const schema = Joi.object({
  email: Joi.string()
  .email()
  .optional(),
  name: Joi.string()
  .optional(),
}).min(1); // Ensure at least one field is provided for update

return schema.validate(request, { abortEarly: false });
};

module.exports = {
  createValidation,
  updateValidation
};
