// create abstract custom error class
// to be extended by other error classes
// to enforce structure and consistency
export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message); // for built-in Error class - logging message

    // To fix prototype chain issue
    // Only because we are extending a built-in class (i.e. Error)
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}
