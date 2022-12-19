import { Request, Response, NextFunction } from 'express';

export const getRoomsList = async (req: Request, res: Response, next: NextFunction) => {
  console.log('req.user', req.user);
  res.status(200).json('Rooms List');
};

export const createRoom = async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json('Create Room');
};

export const getSingleRoom = async (req: Request, res: Response, next: NextFunction) => {
  const { roomId } = req.params;
  res.status(200).json(`Single Room ${roomId}`);
};

export const editRoom = async (req: Request, res: Response, next: NextFunction) => {
  const { roomId } = req.params;
  res.status(200).json(`Edit Room ${roomId}`);
};

export const deleteRoom = async (req: Request, res: Response, next: NextFunction) => {
  const { roomId } = req.params;
  res.status(200).json(`Delete Room ${roomId}`);
};
