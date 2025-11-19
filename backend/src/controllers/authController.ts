import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getTenantModel } from '../utils/getModel';
import UserSchema, { IUser } from '../models/local/UserSchema';

const generateToken = (id: string, role: string, tenantId: string) => {
  return jwt.sign({ id, role, tenantId }, process.env.JWT_SECRET || 'sekret123', {
    expiresIn: '12h',
  });
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, pin } = req.body;
  const dbConnection = req.tenantConnection; 

  if (!dbConnection) {
    return res.status(500).json({ error: 'Database connection failed' });
  }

  try {
    const User = getTenantModel<IUser>(dbConnection, 'User', UserSchema);

    const user = await User.findOne({ username });

    if (user && (await user.matchPin(pin))) {
      const tenantId = req.headers['x-tenant-id'] as string;
      
      res.json({
        _id: user._id,
        name: user.name,
        role: user.role,
        token: generateToken(user._id.toString(), user.role, tenantId),
      });
    } else {
      res.status(401).json({ error: 'Invalid login or PIN' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login error' });
  }
};