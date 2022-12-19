import express from 'express';
import { bookingsController } from '../controllers';
import { passportValidator } from '../middlewares';

const router = express.Router();

router.get('/', passportValidator, bookingsController.getBookingsList);
router.post('/', passportValidator, bookingsController.createBooking);
router.get('/:bookingId', passportValidator, bookingsController.getSingleBooking);
router.patch('/:bookingId', passportValidator, bookingsController.editBooking);
router.delete('/:bookingId', passportValidator, bookingsController.deleteBooking);

export const bookingsRoute = { path: '/bookings', router };
