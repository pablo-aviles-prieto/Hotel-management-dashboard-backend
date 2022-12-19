import express from 'express';
import { roomsController } from '../controllers';
import { passportValidator } from '../middlewares';

const router = express.Router();

router.get('/', passportValidator, roomsController.getRoomsList);
router.post('/', passportValidator, roomsController.createRoom);
router.get('/:roomId', passportValidator, roomsController.getSingleRoom);
router.patch('/:roomId', passportValidator, roomsController.editRoom);
router.delete('/:roomId', passportValidator, roomsController.deleteRoom);

export const roomsRoute = { path: '/rooms', router };
