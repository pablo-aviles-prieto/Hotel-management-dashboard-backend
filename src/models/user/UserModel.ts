import { Schema, model } from 'mongoose';

const UserSchema: Schema = new Schema({
  photo: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    unique: true
  },
  startDate: {
    type: String,
    required: true
  },
  job: {
    position: String,
    description: String,
    schedule: String
  },
  contact: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  }
});

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    delete ret.password;
    delete ret._id;
  }
});

export const UserModel = model('users', UserSchema);
