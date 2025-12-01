import { Router } from 'express';
import { createCategory, createProduct, getMenu, deleteProduct, updateProduct } from '../controllers/menuController';

const router = Router();

router.get('/', getMenu);
router.post('/categories', createCategory);
router.post('/products', createProduct);
router.delete('/products/:id', deleteProduct);
router.put('/products/:id', updateProduct);


export default router;