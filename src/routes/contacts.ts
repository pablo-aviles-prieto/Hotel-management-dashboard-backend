import express from 'express';
import { contactsController } from '../controllers';
import { passportValidator } from '../middlewares';

const router = express.Router();

router.get('/', passportValidator, contactsController.getContactsList);
router.post('/', passportValidator, contactsController.createContact);
router.get('/:contactId', passportValidator, contactsController.getSingleContact);
router.patch('/:contactId', passportValidator, contactsController.editContact);
router.delete('/:contactId', passportValidator, contactsController.deleteContact);

export const contactsRoute = { path: '/contacts', router };
