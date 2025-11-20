import { Schema, Document } from 'mongoose';

export interface IModifierOption {
  name: string;
  price: number;
  isDefault: boolean;
}

export interface IModifierGroup extends Document {
  name: string;
  minSelection: number;
  maxSelection: number;
  options: IModifierOption[];
}

const ModifierOptionSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, default: 0 },
  isDefault: { type: Boolean, default: false }
});

const ModifierGroupSchema = new Schema({
  name: { type: String, required: true },
  minSelection: { type: Number, default: 0 },
  maxSelection: { type: Number, default: 1 },
  options: [ModifierOptionSchema]
});

export default ModifierGroupSchema;