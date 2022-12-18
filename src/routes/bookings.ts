import express from 'express';
import { bookingsController } from '../controllers';

const router = express.Router();

router.get('/test', bookingsController.test);

export const bookingsRoute = { path: '/bookings', router };
