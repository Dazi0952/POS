import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectGlobalDB from './config/database';
import { tenantMiddleware } from './middleware/tenantMiddleware';
import { getTenantModel } from './utils/getModel';
import UserSchema, { IUser } from './models/local/UserSchema';
import { loginUser } from './controllers/authController';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectGlobalDB();

app.get('/', (req, res) => {
  res.send('POS SaaS API Running (Global Scope)');
});

app.use('/api/local', tenantMiddleware);

app.get('/api/local/info', (req: Request, res: Response) => {
  const dbName = req.tenantConnection?.name;
  
  res.json({
    message: `Jesteś w strefie klienta!`,
    connectedToDatabase: dbName,
    status: 'Active connection'
  });
});

app.post('/api/local/users', async (req: Request, res: Response) => {
  try {
    const dbConnection = req.tenantConnection;
    if (!dbConnection) throw new Error('No tenant connection');

    const User = getTenantModel<IUser>(dbConnection, 'User', UserSchema);

    const newUser = await User.create(req.body);

    res.status(201).json({
      message: 'User created in tenant DB!',
      user: newUser,
      dbName: dbConnection.name
    });

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error' });
    }
  }
});

app.post('/api/auth/login', tenantMiddleware, loginUser);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});