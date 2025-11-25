import { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  phone: string;
  name: string;
  lastAddress?: string;
  totalOrders: number;
  lastOrderDate: Date;
}

const CustomerSchema = new Schema({
  phone: { type: String, required: true, unique: true }, 
  name: { type: String },
  lastAddress: { type: String },
  totalOrders: { type: Number, default: 0 },
  lastOrderDate: { type: Date, default: Date.now }
});

export default CustomerSchema;