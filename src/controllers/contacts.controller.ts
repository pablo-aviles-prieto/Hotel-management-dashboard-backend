import { Request, Response, NextFunction } from 'express';
import { db } from '../data/database';
import { IContactsRow } from '../interfaces';
import { OkPacket, RowDataPacket } from 'mysql2';

export const getContactsList = async (req: Request, res: Response, next: NextFunction) => {
  const query = `SELECT * FROM contacts`;
  // console.log('req.user', req.user);

  try {
    const [rawContactsList] = await db.query<IContactsRow[]>(query);
    const contactsList = rawContactsList.map((contact) => {
      const updatedObj = {
        ...contact,
        date: new Date(contact.date).toISOString().substring(0, 10),
        user: {
          name: contact.userName,
          email: contact.userEmail,
          phone: contact.userPhone
        },
        message: {
          subject: contact.messageSubject,
          body: contact.messageBody
        },
        archived: contact.archived ? true : false
      };
      delete updatedObj.userName;
      delete updatedObj.userEmail;
      delete updatedObj.userPhone;
      delete updatedObj.messageSubject;
      delete updatedObj.messageBody;
      return updatedObj;
    });
    res.status(200).json({ result: contactsList });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req: Request, res: Response, next: NextFunction) => {
  const query = `INSERT INTO contacts SET ?`;
  const { user, message, archived } = req.body;
  //Initializing archived property as false when created a new contact.
  const contactToInsertOnDB = {
    date: new Date().toISOString().substring(0, 10),
    userName: user.name,
    userEmail: user.email,
    userPhone: user.phone,
    messageSubject: message.subject,
    messageBody: message.body,
    archived: archived !== undefined ? archived : false
  };

  try {
    //TODO Check inputs before saving on DB
    const [resultCreatingContact] = await db.query<OkPacket>(query, contactToInsertOnDB);
    const insertedObj = {
      ...req.body,
      id: resultCreatingContact.insertId,
      date: contactToInsertOnDB.date,
      archived: false
    };
    res.status(201).json({ result: insertedObj });
  } catch (error) {
    next(error);
  }
};

export const getSingleContact = async (req: Request, res: Response, next: NextFunction) => {
  const { contactId } = req.params;
  const query = `SELECT * FROM contacts WHERE id = ?`;

  try {
    const [getContact] = await db.query<IContactsRow[]>(query, parseInt(contactId));
    if (getContact.length === 0)
      return res.status(400).json({ result: 'Error fetching the contact' });

    const parsedContact = {
      ...getContact[0],
      user: {
        name: getContact[0].userName,
        email: getContact[0].userEmail,
        phone: getContact[0].userPhone
      },
      message: {
        subject: getContact[0].messageSubject,
        body: getContact[0].messageBody
      },
      date: new Date(getContact[0].date).toISOString().substring(0, 10),
      archived: getContact[0].archived ? true : false
    };
    delete parsedContact.userName;
    delete parsedContact.userEmail;
    delete parsedContact.userPhone;
    delete parsedContact.messageSubject;
    delete parsedContact.messageBody;

    res.status(200).json({ result: parsedContact });
  } catch (error) {
    next(error);
  }
};

export const editContact = async (req: Request, res: Response, next: NextFunction) => {
  const { contactId } = req.params;
  const queryGetContact = `SELECT * FROM contacts WHERE id = ?`;
  const queryEdit = `UPDATE contacts SET ? WHERE id = ?`;
  const { user, message, archived } = req.body;

  try {
    const [getContact] = await db.query<RowDataPacket[]>(queryGetContact, parseInt(contactId));
    if (getContact.length === 0)
      return res.status(400).json({ result: 'Error editing the contact' });

    const contactToUpdateOnDB = {
      userName: user?.name ? user.name : getContact[0].userName,
      userEmail: user?.email ? user.email : getContact[0].userEmail,
      userPhone: user?.phone ? user.phone : getContact[0].userPhone,
      messageSubject: message?.subject ? message.subject : getContact[0].messageSubject,
      messageBody: message?.body ? message.body : getContact[0].messageBody,
      archived: archived !== undefined ? archived : getContact[0].archived
    };
    //TODO Check inputs before saving on DB
    await db.query<OkPacket>(queryEdit, [contactToUpdateOnDB, parseInt(contactId)]);
    res.status(202).json({ result: 'Contact updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req: Request, res: Response, next: NextFunction) => {
  const { contactId } = req.params;
  const query = `DELETE FROM contacts WHERE id = ?`;
  try {
    const [result] = await db.query<OkPacket>(query, parseInt(contactId));
    if (result.affectedRows === 0) {
      return res.status(404).json({ result: 'Error deleting the selected contact' });
    }

    res.status(202).json({ result: 'Contact deleted successfully' });
  } catch (error) {
    next(error);
  }
};
