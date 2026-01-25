import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
      session?: { jwt?: string };
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session?.jwt) {
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      process.env.JWT_KEY!, // checked on startup
    ) as UserPayload;

    // Storing the payload on req.currentUser
    req.currentUser = payload;
  } catch (err) {
    console.error('Error verifying JWT in currentUser middleware:', err);
  }

  next();
};
