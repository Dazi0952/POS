import { Router } from 'express';
// Importujemy oba kontrolery:
import { getDailyStats } from '../controllers/reportsController';
import { getEmployeeSettlements } from '../controllers/settlementController';

const router = Router();

// Trasa dla Dashboardu (wykresy)
router.get('/daily', getDailyStats);

// Trasa dla Managera (tabelka pracowników)
// To naprawi błąd 404, który miałeś wcześniej
router.get('/settlements', getEmployeeSettlements);

export default router;