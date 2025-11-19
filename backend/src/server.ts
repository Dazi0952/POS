import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectGlobalDB from './config/database';
import { tenantMiddleware } from './middleware/tenantMiddleware';

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});