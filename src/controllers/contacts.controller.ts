import { Request, Response, NextFunction } from 'express';

export const getContactsList = async (req: Request, res: Response, next: NextFunction) => {
  console.log('req.user', req.user);
  res.status(200).json('Contacts List');
};

export const createContact = async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json('Create Contact');
};

export const getSingleContact = async (req: Request, res: Response, next: NextFunction) => {
  const { contactId } = req.params;
  res.status(200).json(`Single Contact ${contactId}`);
};

export const editContact = async (req: Request, res: Response, next: NextFunction) => {
  const { contactId } = req.params;
  res.status(200).json(`Edit Contact ${contactId}`);
};

export const deleteContact = async (req: Request, res: Response, next: NextFunction) => {
  const { contactId } = req.params;
  res.status(200).json(`Delete Contact ${contactId}`);
};
