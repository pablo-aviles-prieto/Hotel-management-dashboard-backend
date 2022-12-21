import { Request, Response, NextFunction } from 'express';
import { IError } from '../interfaces';

export const errorHandler = (err: IError, req: Request, res: Response, next: NextFunction): void => {
  if (err.message === 'Unauthorized') {
    res.status(err.status || 401).json({ error: err.message });
    return;
  }
  res.status(err.status || 500).json({ error: err });
};
