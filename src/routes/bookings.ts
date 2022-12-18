import express from 'express';
import { bookingsController } from '../controllers';

const router = express.Router();

router.get('/list', bookingsController.getBookingsList);
router.get('/new', bookingsController.createBooking);
router.get('/selected', bookingsController.getSingleBooking);
router.get('/selected/edit', bookingsController.editBooking);

export const bookingsRoute = { path: '/bookings', router };
