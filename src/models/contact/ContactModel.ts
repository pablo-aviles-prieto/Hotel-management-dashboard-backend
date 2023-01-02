import { Schema, model } from 'mongoose';

const ContactSchema: Schema = new Schema({
  date: {
    type: String,
    required: true
  },
  user: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  message: {
    subject: { type: String, required: true },
    body: { type: String, required: true }
  },
  archived: {
    type: Boolean,
    required: true
  }
});

ContactSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    delete ret._id;
  }
});

export const ContactModel = model('contacts', ContactSchema);
