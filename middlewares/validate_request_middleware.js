const { ValidationError } = require('express-json-validator-middleware');

const validateRequestWare = (error, req, response, next) => {
  if (response.headersSent) {
    return next(error);
  }

  const isValidationError = error instanceof ValidationError;
  if (!isValidationError) {
    return next(error);
  }

  response.status(400).json({
    errors: error.validationErrors,
  });

  next();
};

module.exports = validateRequestWare;
