import { Request, Response } from 'express';
import { getTenantModel } from '../utils/getModel';
import OrderSchema from '../models/local/OrderSchema';

export const getDailyStats = async (req: Request, res: Response) => {
  try {
    const db = req.tenantConnection;
    if (!db) return res.status(500).json({ error: 'No DB connection' });

    const Order = getTenantModel(db, 'Order', OrderSchema);

    
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    
    const stats = await Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startOfDay, $lte: endOfDay },
          status: { $ne: 'cancelled' } 
        } 
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: "$totalAmount" }
        }
      }
    ]);

    
    const ordersByType = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfDay, $lte: endOfDay } } },
      {
        $group: {
          _id: "$orderType",
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    res.json({
      summary: stats[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 },
      byType: ordersByType
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Report error' });
  }
};