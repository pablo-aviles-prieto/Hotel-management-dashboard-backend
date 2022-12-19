import express from 'express';
import { authController } from '../controllers'; 

const router = express.Router();

router.post('/login', authController.loginUser);
router.post('/register', authController.createNewUser);

export const authRoute = { path: '', router };
