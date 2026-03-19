'use server'

import { adminDb } from '@/lib/firebase/adminConfig';

export async function getAdminStatsServer() {
  try {
    const [products, orders, categories] = await Promise.all([
      adminDb.collection('productos').get(),
      adminDb.collection('orders').get(),
      adminDb.collection('categorias').get(),
    ]);

    let totalSales = 0;
    let pendingOrders = 0;

    orders.docs.forEach(doc => {
      const data = doc.data();
      if (data.payment?.status === 'APPROVED') {
        totalSales += data.total || 0;
      }
      if (data.status === 'pendiente') {
        pendingOrders++;
      }
    });

    return {
      totalProducts: products.size,
      totalOrders: orders.size,
      totalSales,
      totalCategories: categories.size,
      pendingOrders,
    };
  } catch (error) {
    console.error('Error getting admin stats:', error);
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalSales: 0,
      totalCategories: 0,
      pendingOrders: 0,
    };
  }
}