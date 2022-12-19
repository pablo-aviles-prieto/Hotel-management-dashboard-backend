import express from 'express';
import { usersController } from '../controllers';

const router = express.Router();

router.post('/register', usersController.createNewUser);
router.post('/login', usersController.loginUser);

export const usersRoute = { path: '/users', router };
