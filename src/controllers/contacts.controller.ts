import { Request, Response, NextFunction } from 'express';
import { ContactModel } from '../models';

export const getContactsList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usersList = await ContactModel.find().exec();
    res.status(200).json({ result: usersList });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req: Request, res: Response, next: NextFunction) => {
  const { date, user, message, archived } = req.body;

  const contact = new ContactModel({
    date,
    user,
    message,
    archived
  });

  try {
    const result = await contact.save();
    res.status(201).json({ result });
  } catch (error) {
    next(error);
  }
};

export const getSingleContact = async (req: Request, res: Response, next: NextFunction) => {
  const { contactId } = req.params;

  try {
    const user = await ContactModel.findById(contactId).exec();
    if (!user) return res.status(400).json({ result: 'Error fetching the contact' });
    res.status(200).json({ result: user });
  } catch (error) {
    next(error);
  }
};

export const editContact = async (req: Request, res: Response, next: NextFunction) => {
  const { contactId } = req.params;

  try {
    const existContact = await ContactModel.findById(contactId).exec();
    if (!existContact) return res.status(400).send({ result: 'Error fetching the user' });

    for (const property in req.body) {
      existContact[property] = req.body[property];
    }

    await existContact.save();

    res.status(202).json({ result: existContact });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req: Request, res: Response, next: NextFunction) => {
  const { contactId } = req.params;

  try {
    const existContact = await ContactModel.findById(contactId).exec();
    if (!existContact) return res.status(400).send({ result: 'Error deleting the contact' });

    await existContact.delete();

    res.status(202).json({ result: 'Contact deleted successfully' });
  } catch (error) {
    next(error);
  }
};
