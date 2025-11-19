import mongoose, { Schema, Document } from 'mongoose';

export interface ITenant extends Document {
  name: string;
  tenantId: string;
  dbName: string;
  status: 'active' | 'inactive' | 'trial';
  createdAt: Date;
}

const TenantSchema: Schema = new Schema({
  name: { type: String, required: true },
  tenantId: { type: String, required: true, unique: true },
  dbName: { type: String, required: true, unique: true },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'trial'], 
    default: 'active' 
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ITenant>('Tenant', TenantSchema);