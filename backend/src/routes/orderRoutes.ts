import { Router } from 'express';
import { createOrder, getOrders, closeOrder } from '../controllers/orderController';

const router = Router();

router.post('/', createOrder);
router.get('/', getOrders); 
router.post('/:id/close', closeOrder); 

export default router;