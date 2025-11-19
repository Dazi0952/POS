import mongoose, { Connection } from 'mongoose';
import Tenant from '../models/global/Tenant';
import dotenv from 'dotenv';

dotenv.config();

const connectionMap = new Map<string, Connection>();

export const getConnection = async (tenantId: string): Promise<Connection | null> => {
  
  if (connectionMap.has(tenantId)) {
    return connectionMap.get(tenantId) as Connection;
  }

  const tenant = await Tenant.findOne({ tenantId });
  
  if (!tenant) {
    return null;
  }

  const globalUri = process.env.MONGO_URI_GLOBAL || '';
  const baseUri = globalUri.substring(0, globalUri.lastIndexOf('/')); 
  const args = globalUri.substring(globalUri.indexOf('?'));

  const tenantUri = `${baseUri}/${tenant.dbName}${args.startsWith('?') ? args : ''}`;

  try {
    const conn = mongoose.createConnection(tenantUri);
    
    connectionMap.set(tenantId, conn);
    
    console.log(`[SaaS] New connection created for: ${tenant.name} (${tenant.dbName})`);
    
    return conn;

  } catch (error) {
    console.error('Error creating tenant connection:', error);
    return null;
  }
};