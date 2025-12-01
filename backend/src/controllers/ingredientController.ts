import { Request, Response } from 'express';
import { getTenantModel } from '../utils/getModel';
import IngredientSchema from '../models/local/IngredientSchema';

export const getIngredients = async (req: Request, res: Response) => {
  try {
    const db = req.tenantConnection;
    if (!db) return res.status(500).json({ error: 'No DB' });
    const Ingredient = getTenantModel(db, 'Ingredient', IngredientSchema);
    const list = await Ingredient.find().sort({ name: 1 });
    res.json(list);
  } catch (error) { res.status(500).json({ error: 'Error' }); }
};

export const createIngredient = async (req: Request, res: Response) => {
  try {
    const db = req.tenantConnection;
    if (!db) return res.status(500).json({ error: 'No DB' });
    const Ingredient = getTenantModel(db, 'Ingredient', IngredientSchema);
    const newItem = await Ingredient.create(req.body);
    res.json(newItem);
  } catch (error) { res.status(500).json({ error: 'Error creating' }); }
};

export const deleteIngredient = async (req: Request, res: Response) => {
  try {
    const db = req.tenantConnection;
    if (!db) return res.status(500).json({ error: 'No DB' });
    const Ingredient = getTenantModel(db, 'Ingredient', IngredientSchema);
    await Ingredient.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) { res.status(500).json({ error: 'Error deleting' }); }
};