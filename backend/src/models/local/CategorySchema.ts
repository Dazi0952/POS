import { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description?: string;
  isVisible: boolean;
}

const CategorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  isVisible: { type: Boolean, default: true }
});

export default CategorySchema;