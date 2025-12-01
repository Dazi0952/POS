import { Schema, Document } from 'mongoose';

export interface IIngredient extends Document {
  name: string;
  category: 'VEG' | 'MEAT' | 'CHEESE' | 'SAUCE' | 'OTHER';
  price: number; // Cena bazowa (lub dla rozmiaru standard)
  isAvailable: boolean;
}

const IngredientSchema = new Schema({
  name: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    enum: ['VEG', 'MEAT', 'CHEESE', 'SAUCE', 'OTHER'], 
    default: 'OTHER' 
  },
  price: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true }
});

export default IngredientSchema;