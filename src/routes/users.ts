import express from 'express';
import { usersController } from '../controllers';
import { passportValidator } from '../middlewares';

const router = express.Router();

router.get('/', passportValidator, usersController.getUsersList);
router.post('/', passportValidator, usersController.createUser);
router.get('/:userId', passportValidator, usersController.getSingleUser);
router.patch('/:userId', passportValidator, usersController.editUser);
router.delete('/:userId', passportValidator, usersController.deleteUser);

export const usersRoute = { path: '/users', router };
