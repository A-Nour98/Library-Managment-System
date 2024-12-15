const Joi = require('joi');

const createValidation = (request) => {
  const schema = Joi.object({
    ISBN: Joi.string()
      .pattern(/^(?:\d{9}X|\d{10}|\d{13})$/) // Validate ISBN-10 or ISBN-13
      .required()
      .messages({
        'string.pattern.base': 'ISBN must be a valid ISBN(10 or 13 digits).',
        'string.empty': 'ISBN is required.',
      }),
    title: Joi.string()
      .required()
      .max(100)
      .messages({
        'string.empty': 'Title is required.',
      }),
    author: Joi.string()
      .required()
      .max(100)
      .messages({
        'string.empty': 'Author is required.',
      }),
    quantity: Joi.number()
    .required()
    .messages({
        'string.empty': 'Quantity is required.',
    })
  });

  return schema.validate(request, { abortEarly: false }); 
};


const updateValidation = (request) => {
  const schema = Joi.object({
    ISBN: Joi.string()
    .pattern(/^(?:\d{9}X|\d{10}|\d{13})$/)
    .max(100)
    .optional(),
    title: Joi.string()
    .max(100)
    .optional(),
    author: Joi.string()    
    .max(100)
    .optional(),
}).min(1); // Ensure at least one field is provided for update

return schema.validate(request, { abortEarly: false });
};

const searchValidation = (request) => {
  const schema = Joi.object({
    keyword: Joi.string()
      .pattern(/^[a-zA-Z0-9\s]*$/) // Allow only alphanumeric characters and spaces
      .max(100) // Set a reasonable length limit
      .required()
      .messages({
        'string.pattern.base': 'Search keyword can only contain letters, numbers, and spaces.',
        'string.empty': 'Search keyword cannot be empty.',
        'string.max': 'Search keyword must be less than 100 characters.',
      }),
  });

return schema.validate(request, { abortEarly: false });
};


module.exports = {
  createValidation,
  updateValidation,
  searchValidation
};
