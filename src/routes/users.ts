import express from 'express';
import { usersController } from '../controllers';
import { passportValidator, uploadMulter } from '../middlewares';

const router = express.Router();

router.get('/', passportValidator, usersController.getUsersList);
router.post('/', passportValidator, uploadMulter.single('photo'), usersController.createUser);
router.get('/:userId', passportValidator, usersController.getSingleUser);
router.patch('/:userId', passportValidator, uploadMulter.single('photo'), usersController.editUser);
router.delete('/:userId', passportValidator, usersController.deleteUser);

export const usersRoute = { path: '/users', router };
