import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import { resolve } from 'path';
import { IContacts } from '../interfaces';

const pathToJSONData = resolve(__dirname, '../assets/data/contacts.json');

export const getContactsList = (req: Request, res: Response, _next: NextFunction) => {
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const contactsList: IContacts[] = JSON.parse(rawData);
  // console.log('req.user', req.user);
  res.status(200).json(contactsList);
};

export const createContact = (req: Request, res: Response, _next: NextFunction) => {
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const contactsList: IContacts[] = JSON.parse(rawData);
  res.status(200).json(contactsList);
};

export const getSingleContact = (req: Request, res: Response, _next: NextFunction) => {
  const { contactId } = req.params;
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const contactsList: IContacts[] = JSON.parse(rawData);
  const getContact = contactsList.find((contact) => contact.id === +contactId);
  res.status(200).json(getContact);
};

export const editContact = (req: Request, res: Response, _next: NextFunction) => {
  const { contactId } = req.params;
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const contactsList: IContacts[] = JSON.parse(rawData);
  const getContact = contactsList.find((contact) => contact.id === +contactId);
  res.status(200).json(getContact);
};

export const deleteContact = (req: Request, res: Response, _next: NextFunction) => {
  const { contactId } = req.params;
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const contactsList: IContacts[] = JSON.parse(rawData);
  const newContactsList = contactsList.filter((contact) => contact.id !== +contactId);
  res.status(200).json(newContactsList);
};
