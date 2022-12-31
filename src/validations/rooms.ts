import Joi from 'joi';

export const createRoomValidation = Joi.object({
  images: [Joi.string(), Joi.array()],
  roomName: Joi.string().required(),
  bedType: Joi.string().required(),
  roomNumber: Joi.number().required(),
  roomFloor: Joi.string().required(),
  roomDescription: Joi.string().required(),
  roomType: Joi.string().required(),
  ratePerNight: Joi.number().required(),
  discount: Joi.number().allow(null),
  facilities: Joi.array(),
  status: Joi.string()
});

export const editRoomValidation = Joi.object({
  images: [Joi.string(), Joi.array()],
  roomName: Joi.string(),
  bedType: Joi.string(),
  roomNumber: Joi.number(),
  roomFloor: Joi.string(),
  roomDescription: Joi.string(),
  roomType: Joi.string(),
  ratePerNight: Joi.number(),
  discount: Joi.number().allow(null),
  facilities: Joi.array(),
  status: Joi.string()
});
