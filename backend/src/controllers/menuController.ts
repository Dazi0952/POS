import { Request, Response } from 'express';
import { getTenantModel } from '../utils/getModel';
import CategorySchema, { ICategory } from '../models/local/CategorySchema';
import ProductSchema, { IProduct } from '../models/local/ProductSchema';

export const createCategory = async (req: Request, res: Response) => {
  try {
    const db = req.tenantConnection;
    if (!db) return res.status(500).json({ error: 'No DB connection' });

    const Category = getTenantModel<ICategory>(db, 'Category', CategorySchema);
    
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: 'Error creating category' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const db = req.tenantConnection;
    if (!db) return res.status(500).json({ error: 'No DB connection' });

    const Product = getTenantModel<IProduct>(db, 'Product', ProductSchema);
    
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error creating product' });
  }
};

export const getMenu = async (req: Request, res: Response) => {
  try {
    const db = req.tenantConnection;
    if (!db) return res.status(500).json({ error: 'No DB connection' });

    const Category = getTenantModel<ICategory>(db, 'Category', CategorySchema);
    const Product = getTenantModel<IProduct>(db, 'Product', ProductSchema);

    const categories = await Category.find({ isVisible: true });
    const products = await Product.find({});

    res.json({ categories, products });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching menu' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const db = req.tenantConnection;
    if (!db) return res.status(500).json({ error: 'No DB connection' });

    const Product = getTenantModel(db, 'Product', ProductSchema);
    const { id } = req.params;

    await Product.findByIdAndDelete(id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting product' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const db = req.tenantConnection;
    if (!db) return res.status(500).json({ error: 'No DB connection' });

    const Product = getTenantModel(db, 'Product', ProductSchema);
    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true } 
    );

    if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error updating product' });
  }
};