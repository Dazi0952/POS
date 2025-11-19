import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../utils/connectionManager';

export const tenantMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  
  const tenantId = req.headers['x-tenant-id'] as string;

  if (!tenantId) {
    return res.status(400).json({ error: 'Missing x-tenant-id header' });
  }

  try {
    const connection = await getConnection(tenantId);

    if (!connection) {
      return res.status(404).json({ error: 'Tenant not found or inactive' });
    }

    req.tenantConnection = connection;

    next();
  } catch (error) {
    console.error('Middleware Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};