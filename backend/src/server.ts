import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectGlobalDB from './config/database';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectGlobalDB();

app.get('/', (req: Request, res: Response) => {
  res.send('POS SaaS API (TypeScript) is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});