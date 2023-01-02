import { Schema, model } from 'mongoose';

const RoomSchema: Schema = new Schema({
  photo: { type: String, required: true },
  roomNumber: { type: Number, required: true },
  roomName: { type: String, required: true },
  bedType: { type: String, required: true },
  roomFloor: { type: String, required: true },
  roomDescription: { type: String, required: true },
  roomType: { type: String, required: true },
  facilities: [{ type: String, required: true }],
  ratePerNight: { type: Number, required: true },
  status: { type: String, required: true },
  offerPrice: Number
});

RoomSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    delete ret._id;
  }
});

export const RoomModel = model('rooms', RoomSchema);
