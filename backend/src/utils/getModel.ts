import { Connection, Model, Schema } from 'mongoose';

export const getTenantModel = <T>(
  connection: Connection, 
  modelName: string, 
  schema: Schema<T>
): Model<T> => {
  
  const models = connection.models;

  if (models[modelName]) {
    return models[modelName] as Model<T>;
  }

  return connection.model<T>(modelName, schema);
};