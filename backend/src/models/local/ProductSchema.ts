import mongoose, { Schema, Document } from 'mongoose';

interface Variant {
  name: string;
  price: number;
}
interface Ingredient {
  name: string;
  price: number;      
  isDefault: boolean;
}

export interface IProduct extends Document {
  name: string;
  categoryId: mongoose.Types.ObjectId;
  description?: string;
  hasVariants: boolean;
  variants: Variant[];       
  ingredients: Ingredient[]; 
  price: number; 
}

const ProductSchema = new Schema({
  name: { type: String, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  description: { type: String },
  
  hasVariants: { type: Boolean, default: false },
  
  variants: [{
    name: String,
    price: Number
  }],
  
  ingredients: [{
    name: String,
    price: { type: Number, default: 0 },
    isDefault: { type: Boolean, default: false },
  }],

  price: { type: Number, default: 0 }
});

export default ProductSchema;