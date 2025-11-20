import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  categoryId: mongoose.Types.ObjectId;
  modifierGroups: mongoose.Types.ObjectId[];
  isAvailable: boolean;
}

const ProductSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  modifierGroups: [{ type: Schema.Types.ObjectId, ref: 'ModifierGroup' }],
  isAvailable: { type: Boolean, default: true }
});

export default ProductSchema;