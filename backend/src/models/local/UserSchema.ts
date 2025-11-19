import { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  pin: string;
  role: 'admin' | 'manager' | 'waiter' | 'kitchen' | 'driver';
  name: string;
  isActive: boolean;
  matchPin(enteredPin: string): Promise<boolean>;
}

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  pin: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'manager', 'waiter', 'kitchen', 'driver'], 
    default: 'waiter' 
  },
  name: { type: String, required: true },
  isActive: { type: Boolean, default: true }
});

UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('pin')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.pin = await bcrypt.hash(this.pin, salt);
  next();
});

UserSchema.methods.matchPin = async function(enteredPin: string): Promise<boolean> {
  return await bcrypt.compare(enteredPin, this.pin);
};

export default UserSchema;