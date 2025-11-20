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

const OrderSchema = new Schema({
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 }
  }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['open', 'kitchen', 'ready', 'closed'], 
    default: 'open' 
  },
  tableNumber: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default OrderSchema;