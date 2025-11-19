import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectGlobalDB from '../config/database';
import Tenant from '../models/global/Tenant';

dotenv.config();

const seedTenants = async () => {
  try {
    await connectGlobalDB();

    const tenantData = {
      name: 'Pizzeria Mario',
      tenantId: 'pizzeria-mario',
      dbName: 'tenant_pizzeria_mario_1',
      status: 'active'
    };
    const exists = await Tenant.findOne({ tenantId: tenantData.tenantId });

    if (exists) {
      console.log('Tenant "Pizzeria Mario" already exists. Skipping...');
    } else {
      const newTenant = await Tenant.create(tenantData);
      console.log('Tenant "Pizzeria Mario" created successfully!');
      console.log(newTenant);
    }

    await mongoose.connection.close();
    console.log('Connection closed.');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedTenants();