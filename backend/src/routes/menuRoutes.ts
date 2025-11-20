import { Router } from 'express';
import { createCategory, createProduct, getMenu } from '../controllers/menuController';

const router = Router();

router.get('/', getMenu);
router.post('/categories', createCategory);
router.post('/products', createProduct);

export default router;