import { CustomError } from './custom-error.js';

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super('💥Route not found');

    // Only because we are extending a built-in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Not Found' }];
  }
}
