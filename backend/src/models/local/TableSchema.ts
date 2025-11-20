import { Schema, Document } from 'mongoose';

export interface ITable extends Document {
  number: string; 
  seats: number;
  status: 'free' | 'occupied' | 'reserved' | 'to-pay';
  currentOrderId?: string;
  posX?: number;
  posY?: number;
}

const TableSchema = new Schema({
  number: { type: String, required: true },
  seats: { type: Number, default: 4 },
  status: { 
    type: String, 
    enum: ['free', 'occupied', 'reserved', 'to-pay'], 
    default: 'free' 
  },
  currentOrderId: { type: Schema.Types.ObjectId, ref: 'Order' },
  posX: { type: Number, default: 0 },
  posY: { type: Number, default: 0 }
});

export default TableSchema;