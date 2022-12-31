import { NextFunction, Request, Response } from 'express';
import { Schema, ValidationError } from 'joi';

export const validateRequest = (schema: Schema) => async (req: Request, res: Response, next: NextFunction) => {
  const options = {
    abortEarly: false,
    allowUnknown: false
  };
  try {
    await schema.validateAsync(req.body, options);
    next();
  } catch (error) {
    next(error);
  }
};
