import { Request, Response } from 'express';
import { getTenantModel } from '../utils/getModel';
import TableSchema, { ITable } from '../models/local/TableSchema';

export const getTables = async (req: Request, res: Response) => {
  try {
    const db = req.tenantConnection;
    if (!db) return res.status(500).json({ error: 'No DB connection' });
    const Table = getTenantModel<ITable>(db, 'Table', TableSchema);
    const tables = await Table.find().sort({ number: 1 }); 
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tables' });
  }
};


export const seedTables = async (req: Request, res: Response) => {
  try {
    const db = req.tenantConnection;
    if (!db) return res.status(500).json({ error: 'No DB connection' });
    const Table = getTenantModel<ITable>(db, 'Table', TableSchema);
    
    const count = await Table.countDocuments();
    if (count > 0) return res.json({ message: 'Tables already exist' });
    
    const tablesToCreate = [];
    for (let i = 1; i <= 12; i++) {
      tablesToCreate.push({ number: i.toString(), seats: 4, status: 'free' });
    }
    
    await Table.insertMany(tablesToCreate);
    res.json({ message: 'Created 12 tables' });
  } catch (error) {
    res.status(500).json({ error: 'Error seeding tables' });
  }
};