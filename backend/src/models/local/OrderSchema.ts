import { Schema, Document } from 'mongoose';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  items: OrderItem[];
  totalAmount: number;
  status: 'open' | 'kitchen' | 'ready' | 'closed';
  tableNumber?: string;
  createdAt: Date;
}

const DeliveryDetailsSchema = new Schema({
  address: { type: String },
  phone: { type: String },
  scheduledTime: { type: String }
}, { _id: false });

const OrderSchema = new Schema({
  dailyNumber: { type: Number, default: 0 },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    details: {
        variant: String,
        ingredients: [{ name: String, quantity: Number, isBase: Boolean }],
        comment: String
    }
  }],

  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['kitchen', 'ready', 'closed'], default: 'kitchen' },
  tableNumber: { type: String },
  orderType: { type: String }, 
  deliveryDetails: {
      name: { type: String },
      address: { type: String },
      phone: { type: String },
      scheduledTime: { type: String }
  },
  createdBy: {type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  paymentMethod: { type: String, enum: ['cash', 'card', 'unpaid'], default: 'unpaid' }
}, { strict: false }); 

export default OrderSchema;