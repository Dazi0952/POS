import { Router } from 'express';
import { getIngredients, createIngredient, deleteIngredient, updateIngredient } from '../controllers/ingredientController';
const router = Router();

router.get('/', getIngredients);
router.post('/', createIngredient);
router.delete('/:id', deleteIngredient);
router.put('/:id', updateIngredient);

export default router;