import 'dotenv/config';

import { Request, Response, NextFunction } from 'express';
import { IError } from '../interfaces';

const { NODE_ENV } = process.env;

export const errorHandler = (err: IError, _req: Request, res: Response, _next: NextFunction): void => {
  if (NODE_ENV !== 'test') console.error('error', err);

  if (err.message === 'Unauthorized') {
    res.status(err.status || 401).json({ error: err.message });
    return;
  }
  res.status(err.status || 500).json({ error: err });
};
