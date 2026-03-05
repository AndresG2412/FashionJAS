import { currentUser } from '@clerk/nextjs/server';
import { getAdminStats } from '@/lib/firebase/admin';
import Link from 'next/link';
import { Package, ShoppingCart, DollarSign, Tag, Clock } from 'lucide-react';
import Container from '../components/Container';

export default async function StudioDashboard() {
  const user = await currentUser();
  const stats = await getAdminStats();
  
  return (
    <Container>
      <h1 className="text-3xl font-bold mb-8 text-center md:text-start text-danashop-textPrimary">
        Bienvenido, {user?.firstName}!
      </h1>

      {/* Estadísticas */}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 mb-8">

        {/* productos */}
        <div className="bg-danashop-bgColorCard shadow-lg/60 shadow-danashop-brandSoft border-2 p-6 rounded-lg border-l-4 border-danashop-brandHover">
          <div className="flex items-center justify-between">
            <div>
              <div className='flex gap-2 items-center'> 
                <Package className="w-6 h-6 text-red-500" />
                <h3 className="text-danashop-textPrimary text-base font-medium tracking-wider">Productos</h3>
              </div>
              <p className="text-3xl font-bold text-danashop-textPrimary mt-2">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        {/* Ordenes */}
        <div className="bg-danashop-bgColorCard shadow-lg/60 shadow-danashop-brandSoft border-2 p-6 rounded-lg border-l-4 border-danashop-brandHover">
          <div className="flex items-center justify-between">
            <div>
              <div className='flex gap-2 items-center'> 
                <ShoppingCart className="w-6 h-6 text-blue-500" />
                <h3 className="text-danashop-textPrimary text-base font-medium tracking-wider">Órdenes</h3>
              </div>
              <div className='flex gap-3 items-center'>
                <p className="text-3xl font-bold mt-2 text-danashop-textPrimary">{stats.totalOrders}</p>
                {stats.pendingOrders > 0 && (
                  <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {stats.pendingOrders} pendientes
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Ventas Dinero - Coordinar*/}

        {/* <div className="bg-white shadow-2xl border-2 p-6 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <div className='flex gap-2 items-center'> 
                <DollarSign className="w-6 h-6 text-green-500 opacity-20" />
                <h3 className="text-gray-500 text-sm font-medium">Ventas Totales</h3>
              </div>
              <p className="text-3xl font-bold mt-2">
                {stats.totalSales.toLocaleString('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0,
                })}
              </p>
            </div>
          </div>
        </div> */}

        {/* Categorias */}
        <div className="bg-danashop-bgColorCard shadow-lg/60 shadow-danashop-brandSoft border-2 p-6 rounded-lg border-l-4 border-danashop-brandHover">
          <div className="flex items-center justify-between">
            <div>
              <div className='flex gap-2 items-center'> 
                <Tag className="w-6 h-6 text-yellow-500" />
                <h3 className="text-danashop-textPrimary text-sm font-medium">Categorías</h3>
              </div>
              <p className="text-3xl text-danashop-textPrimary font-bold mt-2">{stats.totalCategories}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
        <div className="bg-danashop-bgColorCard shadow-lg/60 shadow-danashop-brandSoft border-2 p-6 rounded-lg border-l-4 border-danashop-brandHover">
        <h2 className="text-xl font-bold mb-4 text-danashop-textPrimary">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            href="/studio/products" 
            className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-700"
          >
            <Package className="w-5 h-5" />
            <span className="font-medium">Ver Productos</span>
          </Link>
          
          <Link 
            href="/studio/categories" 
            className="flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors border border-green-700"
          >
            <Tag className="w-5 h-5" />
            <span className="font-medium">Ver Categorías</span>
          </Link>
          
          <Link 
            href="/studio/orders" 
            className="flex items-center gap-3 px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors border border-purple-700"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="font-medium">Ver Órdenes</span>
          </Link>
        </div>
      </div>
    </Container>
  );
}