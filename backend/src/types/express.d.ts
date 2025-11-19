import { Connection } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      tenantConnection?: Connection;
    }
  }
}