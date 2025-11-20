import { Router } from 'express';
import { getTables, seedTables } from '../controllers/tableController';

const router = Router();
router.get('/', getTables);
router.post('/seed', seedTables);

export default router;