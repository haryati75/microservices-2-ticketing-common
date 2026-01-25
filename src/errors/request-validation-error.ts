import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error.js';

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super('💥Invalid request parameters');

    // Only because we are extending a built-in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => {
      const result = { message: err.msg };
      if (err.type === 'field') return { ...result, field: err.path };
      return result;
    });
  }
}
