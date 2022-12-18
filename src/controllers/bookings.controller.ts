import { Request, Response, NextFunction } from 'express';

export const test = async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json('Hello world');
};
