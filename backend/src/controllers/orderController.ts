import { Request, Response } from 'express';
import { getTenantModel } from '../utils/getModel';
import OrderSchema, { IOrder } from '../models/local/OrderSchema';
import TableSchema, { ITable } from '../models/local/TableSchema';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const db = req.tenantConnection;
    if (!db) return res.status(500).json({ error: 'No DB connection' });

    const Order = getTenantModel<IOrder>(db, 'Order', OrderSchema);
    const Table = getTenantModel<ITable>(db, 'Table', TableSchema);

    const { items, totalAmount, tableNumber } = req.body; 

    const newOrder = await Order.create({
      items,
      totalAmount,
      tableNumber, 
      status: 'kitchen'
    });

    if (tableNumber) {
      await Table.findOneAndUpdate(
        { number: tableNumber },
        { 
          status: 'occupied', 
          currentOrderId: newOrder._id
        }
      );
    }

    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not create order' });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const db = req.tenantConnection;
    if (!db) return res.status(500).json({ error: 'No DB connection' });

    const Order = getTenantModel<IOrder>(db, 'Order', OrderSchema);
    
    const orders = await Order.find().sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
};

export const closeOrder = async (req: Request, res: Response) => {
  try {
    const db = req.tenantConnection;
    if (!db) return res.status(500).json({ error: 'No DB connection' });

    const Order = getTenantModel<IOrder>(db, 'Order', OrderSchema);
    const Table = getTenantModel<ITable>(db, 'Table', TableSchema);

    const { id } = req.params; // ID zamówienia

    // 1. Znajdź i zaktualizuj zamówienie (status -> closed)
    const order = await Order.findByIdAndUpdate(
      id,
      { status: 'closed' },
      { new: true }
    );

    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.tableNumber) {
      await Table.findOneAndUpdate(
        { number: order.tableNumber },
        { 
          status: 'free', 
          $unset: { currentOrderId: 1 }
        }
      );
    }

    res.json({ message: 'Order closed and table freed', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error closing order' });
  }
};