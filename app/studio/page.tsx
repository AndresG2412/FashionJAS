import { currentUser } from '@clerk/nextjs/server';
import { getAdminStats } from '@/lib/firebase/admin';
import Link from 'next/link';
import { Package, ShoppingCart, DollarSign, Tag, Clock } from 'lucide-react';

export default async function StudioDashboard() {
  const user = await currentUser();
  const stats = await getAdminStats();
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Bienvenido, {user?.firstName}! 👋
      </h1>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Productos</h3>
              <p className="text-3xl font-bold mt-2">{stats.totalProducts}</p>
            </div>
            <Package className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Órdenes</h3>
              <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
              {stats.pendingOrders > 0 && (
                <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {stats.pendingOrders} pendientes
                </p>
              )}
            </div>
            <ShoppingCart className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Ventas Totales</h3>
              <p className="text-3xl font-bold mt-2">
                {stats.totalSales.toLocaleString('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0,
                })}
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-purple-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Categorías</h3>
              <p className="text-3xl font-bold mt-2">{stats.totalCategories}</p>
            </div>
            <Tag className="w-12 h-12 text-yellow-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            href="/studio/products" 
            className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
          >
            <Package className="w-5 h-5" />
            <span className="font-medium">Ver Productos</span>
          </Link>
          
          <Link 
            href="/studio/categories" 
            className="flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
          >
            <Tag className="w-5 h-5" />
            <span className="font-medium">Ver Categorías</span>
          </Link>
          
          <Link 
            href="/studio/orders" 
            className="flex items-center gap-3 px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="font-medium">Ver Órdenes</span>
          </Link>
        </div>
      </div>
    </div>
  );
}