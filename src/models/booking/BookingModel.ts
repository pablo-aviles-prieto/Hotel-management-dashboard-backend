import { Schema, model } from 'mongoose';

const BookingSchema: Schema = new Schema({
  bookingNumber: {
    type: Number,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  orderDate: {
    type: String,
    required: true
  },
  checkIn: {
    type: String,
    required: true
  },
  checkOut: {
    type: String,
    required: true
  },
  specialRequest: String,
  status: {
    type: String,
    required: true
  },
  roomId: {
    type: Schema.Types.ObjectId,
    ref: 'rooms',
    required: true
  }
});

BookingSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    delete ret._id;
  }
});

export const BookingModel = model('bookings', BookingSchema);
