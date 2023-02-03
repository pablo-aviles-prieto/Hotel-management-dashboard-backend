import express from 'express';
import { roomsController } from '../controllers';
import { passportValidator, uploadMulter } from '../middlewares';

const router = express.Router();

router.get('/', passportValidator, roomsController.getRoomsList);
router.post('/', passportValidator, uploadMulter.single('images'), roomsController.createRoom);
router.get('/:roomId', passportValidator, roomsController.getSingleRoom);
router.patch('/:roomId', passportValidator, uploadMulter.single('images'), roomsController.editRoom);
router.delete('/:roomId', passportValidator, roomsController.deleteRoom);

export const roomsRoute = { path: '/rooms', router };
