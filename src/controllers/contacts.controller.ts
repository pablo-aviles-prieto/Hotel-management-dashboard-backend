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
  //TODO Check inputs before saving on DB
  //TODO Return the created Obj
  res.status(201).json(contactsList);
};

export const getSingleContact = (req: Request, res: Response, _next: NextFunction) => {
  const { contactId } = req.params;
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const contactsList: IContacts[] = JSON.parse(rawData);
  const getContact = contactsList.find((contact) => contact.id === +contactId);
  if (!getContact) {
    res.status(422).end();
    return;
  }
  res.status(200).json(getContact);
};

export const editContact = (req: Request, res: Response, _next: NextFunction) => {
  const { contactId } = req.params;
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const contactsList: IContacts[] = JSON.parse(rawData);
  const getContact = contactsList.find((contact) => contact.id === +contactId);

  if (!getContact) {
    res.status(422).end();
    return;
  }

  //TODO Check inputs before saving on DB

  const newContactsArr = [...contactsList];
  const indexOfObj = newContactsArr.findIndex((obj) => obj.id === +contactId);
  newContactsArr[indexOfObj] = {
    ...newContactsArr[indexOfObj],
    ...req.body
  };

  res.status(202).json(newContactsArr);
};

export const deleteContact = (req: Request, res: Response, _next: NextFunction) => {
  const { contactId } = req.params;
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const contactsList: IContacts[] = JSON.parse(rawData);
  const contactSelected = contactsList.find((contact) => contact.id === +contactId);

  // await new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve('');
  //   }, 2000);
  // });

  if (!contactSelected) {
    res.status(422).end();
    return;
  }

  res.status(204).end();
};
