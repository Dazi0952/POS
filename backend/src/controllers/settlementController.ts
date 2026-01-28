import { Request, Response } from 'express';
import { getTenantModel } from '../utils/getModel';
import OrderSchema from '../models/local/OrderSchema';
import UserSchema from '../models/local/UserSchema';

export const getEmployeeSettlements = async (req: Request, res: Response) => {
  try {
    const db = req.tenantConnection;
    if (!db) return res.status(500).json({ error: 'No DB' });

    const Order = getTenantModel(db, 'Order', OrderSchema);
    const User = getTenantModel(db, 'User', UserSchema);

    
    const now = new Date();
    const startOfDay = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0));
    const endOfDay = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59));

    
    const report = await Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startOfDay, $lte: endOfDay },
          status: { $ne: 'cancelled' } 
        } 
      },
      {
        $group: {
          _id: { 
            user: "$createdBy", 
            
            
            method: { $ifNull: ["$paymentMethod", "unpaid"] } 
          },
          total: { $sum: "$totalAmount" },
          count: { $sum: 1 }
        }
      }
    ]);

    console.log("=== DEBUG RAPORTU ===");
    console.log("Znalezione zamówienia (agregacja):", JSON.stringify(report, null, 2));
    
    const users = await User.find();
    console.log("Znalezieni pracownicy:", JSON.stringify(users, null, 2));
    const userMap = users.reduce((acc, u) => ({ ...acc, [u._id.toString()]: u.name }), {} as any);

    
    const result = report.reduce((acc: any, row) => {
      const userId = row._id.user ? row._id.user.toString() : 'unknown';
      const userName = userMap[userId] || 'Nieznany / Online';
      const method = row._id.method; 

      if (!acc[userId]) {
        acc[userId] = { name: userName, cash: 0, card: 0, unpaid: 0, total: 0 };
      }

      if (method === 'cash') acc[userId].cash += row.total;
      else if (method === 'card') acc[userId].card += row.total;
      else acc[userId].unpaid += row.total; 

      acc[userId].total += row.total;
      return acc;
    }, {});

    res.json(Object.values(result)); 

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};