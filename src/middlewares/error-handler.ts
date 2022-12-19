import { Request, Response, NextFunction } from 'express';
import { IError } from '../interfaces';

export const errorHandler = (err: IError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({ error: err });
};
