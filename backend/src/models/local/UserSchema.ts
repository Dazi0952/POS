import { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  pin: string;
  role: 'admin' | 'manager' | 'waiter' | 'kitchen' | 'driver';
  name: string;
  isActive: boolean;
}

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true }, // unikalny w obrębie restauracji
  pin: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'manager', 'waiter', 'kitchen', 'driver'], 
    default: 'waiter' 
  },
  name: { type: String, required: true },
  isActive: { type: Boolean, default: true }
});

export default UserSchema;