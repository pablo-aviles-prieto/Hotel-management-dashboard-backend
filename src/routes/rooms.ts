import express from 'express';
import { roomsController } from '../controllers';
import { passportValidator, validateRequest } from '../middlewares';
import { createRoomValidation, editRoomValidation } from '../validations';

const router = express.Router();

router.get('/', passportValidator, roomsController.getRoomsList);
router.post('/', validateRequest(createRoomValidation), passportValidator, roomsController.createRoom);
router.get('/:roomId', passportValidator, roomsController.getSingleRoom);
router.patch('/:roomId', validateRequest(editRoomValidation), passportValidator, roomsController.editRoom);
router.delete('/:roomId', passportValidator, roomsController.deleteRoom);

export const roomsRoute = { path: '/rooms', router };
