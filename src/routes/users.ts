import express from 'express';
import { usersController } from '../controllers';
import { passportValidator } from '../middlewares';

const router = express.Router();

router.post('/login', usersController.loginUser);
router.post('/new', usersController.createNewUser);
router.get('/:userId', passportValidator, usersController.getSingleUser);
router.patch('/:userId', passportValidator, usersController.editUser);
router.delete('/:userId', passportValidator, usersController.deleteUser);

export const usersRoute = { path: '/users', router };
