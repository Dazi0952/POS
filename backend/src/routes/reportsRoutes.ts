import { Router } from 'express';

import { getDailyStats } from '../controllers/reportsController';
import { getEmployeeSettlements } from '../controllers/settlementController';

const router = Router();


router.get('/daily', getDailyStats);



router.get('/settlements', getEmployeeSettlements);

export default router;