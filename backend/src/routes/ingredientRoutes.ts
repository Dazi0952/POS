import { Router } from 'express';
import { getIngredients, createIngredient, deleteIngredient } from '../controllers/ingredientController';
const router = Router();

router.get('/', getIngredients);
router.post('/', createIngredient);
router.delete('/:id', deleteIngredient);

export default router;