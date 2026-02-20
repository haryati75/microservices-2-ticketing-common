import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error.js';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({
      errors: err.serializeErrors(),
    });
  }

  console.error('⛈️🥦 Unknown Error: ', err);
  res.status(500).send({
    errors: [{ message: 'Something went wrong 🥕' }],
  });
};
