import { Router } from 'express';
import { createOrder, getOrders, updateOrder, closeOrder } from '../controllers/orderController';

const router = Router();

router.post('/', createOrder);
router.get('/', getOrders); 
router.post('/:id/close', closeOrder); 
router.put('/:id', updateOrder);

export default router;