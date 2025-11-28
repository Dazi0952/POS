import { Router } from 'express';
import { getEmployeeSettlements } from '../controllers/settlementController';
const router = Router();

router.get('/settlements', getEmployeeSettlements);

export default router;