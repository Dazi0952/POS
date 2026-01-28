
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CategorySchema from '../models/local/CategorySchema';
import ProductSchema from '../models/local/ProductSchema';

import { menuData } from './data/menu-data'; 

dotenv.config();



const TARGET_DB_URI = 'mongodb+srv://admin:haslo123@cluster0.5ifydrn.mongodb.net/tenant_pizzeria_mario_1?appName=Cluster0'; 


const importData = async () => {
  try {
    console.log(`Łączenie z bazą: ${TARGET_DB_URI}...`);
    const conn = await mongoose.connect(TARGET_DB_URI);
    console.log('Połączono!');

    
    const Category = conn.model('Category', CategorySchema);
    const Product = conn.model('Product', ProductSchema);

    console.log('Czyszczenie starego menu...');
    await Product.deleteMany({});
    await Category.deleteMany({});

    console.log('Rozpoczynam import...');

    for (const catData of menuData) {
      
      const category = await Category.create({
        name: catData.categoryName,
        description: catData.description || '',
        isVisible: true
      });
      console.log(`Utworzono kategorię: ${category.name}`);

      
      const productsWithId = catData.products.map(p => ({
        ...p,
        categoryId: category._id, 
        isAvailable: true 
      }));

      
      await Product.insertMany(productsWithId);
      console.log(`   └─ Dodano ${productsWithId.length} produktów.`);
    }

    console.log('ZAKOŃCZONO SUKCESEM! Menu jest w bazie.');
    process.exit(0);

  } catch (error) {
    console.error('Błąd importu:', error);
    process.exit(1);
  }
};

importData();