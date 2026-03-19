import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { Package, ShoppingCart, Tag, Clock, ArrowRight } from 'lucide-react';
import Container from '../components/Container';
import { getAdminStatsServer } from '@/app/actions/adminStats';

export default async function StudioDashboard() {
  const user = await currentUser();
  const stats = await getAdminStatsServer();
  
  // Clases reutilizables para las tarjetas de estadísticas
  const statCardClass = "bg-eshop-bgWhite shadow-sm border border-eshop-borderSubtle p-6 rounded-2xl border-l-4 border-l-eshop-accent hoverEffect hover:shadow-md";
  const iconClass = "w-6 h-6 text-eshop-accent";
  const labelClass = "text-eshop-textSecondary text-xs font-bold uppercase tracking-widest";
  const valueClass = "text-3xl font-medium text-eshop-textPrimary mt-2";

  return (
    <Container className="py-10">
      <div className="mb-10 text-center md:text-start">
        <h1 className="text-3xl font-semibold text-eshop-textPrimary tracking-wide">
          Bienvenido, {user?.firstName}!
        </h1>
      </div>

      {/* ── Sección de Estadísticas ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

        {/* Productos */}
        <div className={statCardClass}>
          <div className="flex items-center justify-between">
            <div>
              <div className='flex gap-2.5 items-center mb-1'> 
                <Package className={iconClass} />
                <h3 className={labelClass}>Productos</h3>
              </div>
              <p className={valueClass}>{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        {/* Ordenes */}
        <div className={statCardClass}>
          <div className="flex items-center justify-between">
            <div>
              <div className='flex gap-2.5 items-center mb-1'> 
                <ShoppingCart className={iconClass} />
                <h3 className={labelClass}>Órdenes</h3>
              </div>
              <div className='flex gap-3 items-end'>
                <p className={valueClass}>{stats.totalOrders}</p>
                {stats.pendingOrders > 0 && (
                  <div className="mb-1.5 px-2 py-0.5 bg-eshop-accent/10 rounded-full flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-eshop-accent" />
                    <span className="text-[10px] font-bold text-eshop-accent uppercase tracking-tighter">
                      {stats.pendingOrders} pendientes
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Categorías */}
        <div className={statCardClass}>
          <div className="flex items-center justify-between">
            <div>
              <div className='flex gap-2.5 items-center mb-1'> 
                <Tag className={iconClass} />
                <h3 className={labelClass}>Categorías</h3>
              </div>
              <p className={valueClass}>{stats.totalCategories}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Acciones Rápidas ── */}
      <div className="bg-eshop-bgWhite rounded-2xl border border-eshop-borderSubtle p-8 shadow-sm">
        <h2 className="text-sm font-semibold mb-6 text-eshop-textPrimary uppercase tracking-widest flex items-center gap-2">
           <span className="w-8 h-0.5 bg-eshop-accent inline-block"></span>
           Acciones Rápidas
           <span className="w-auto h-0.5 bg-eshop-accent inline-block"></span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link 
            href="/studio/products" 
            className="flex items-center justify-between group px-5 py-4 rounded-xl bg-eshop-buttonBase hover:bg-eshop-buttonHover text-eshop-textDark hoverEffect border border-eshop-borderSubtle"
          >
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5" />
              <span className="font-medium text-base">Gestionar Productos</span>
            </div>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 hoverEffect -translate-x-2 group-hover:translate-x-0" />
          </Link>
          
          <Link 
            href="/studio/categories" 
            className="flex items-center justify-between group px-5 py-4 rounded-xl bg-eshop-buttonBase hover:bg-eshop-buttonHover text-eshop-textDark hoverEffect border border-eshop-borderSubtle"
          >
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5" />
              <span className="font-medium text-base">Gestionar Categorías</span>
            </div>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 hoverEffect -translate-x-2 group-hover:translate-x-0" />
          </Link>
          
          <Link 
            href="/studio/orders" 
            className="flex items-center justify-between group px-5 py-4 rounded-xl bg-eshop-buttonBase hover:bg-eshop-buttonHover text-eshop-textDark hoverEffect border border-eshop-borderSubtle"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium text-base">Revisar Órdenes</span>
            </div>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 hoverEffect -translate-x-2 group-hover:translate-x-0" />
          </Link>
        </div>
      </div>
    </Container>
  );
}