import { SignOutButton } from '@clerk/nextjs'
import React from 'react'
import { auth, currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import AdminSidebar from './AdminSidebar';

const HeaderAdmin = async() => {
    const user = await currentUser();
    
    return (
        <>
            {/* BOTÓN MÓVIL: Aparece solo en pantallas pequeñas */}
            <div className="md:hidden fixed top-4 left-4 z-60">
                <AdminSidebar />
            </div>

            {/* SIDEBAR ESCRITORIO: Oculto en móviles (hidden), visible en md:flex */}
            <aside className="hidden md:flex flex-col sticky top-0 h-screen w-64 bg-gray-900 text-white z-50">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-shop_light_green">GaboShop Admin</h1>
                    <p className="text-xs text-gray-400">{user?.emailAddresses[0].emailAddress}</p>
                </div>
              
                <nav className="mt-8 flex-1">
                    <Link href="/studio" className="block px-6 py-3 hover:bg-gray-800 transition">📊 Panel Principal</Link>
                    <Link href="/studio/products" className="block px-6 py-3 hover:bg-gray-800 transition">📦 Productos</Link>
                    <Link href="/studio/categories" className="block px-6 py-3 hover:bg-gray-800 transition">🏷️ Categorias</Link>
                    <Link href="/studio/orders" className="block px-6 py-3 hover:bg-gray-800 transition">🛒 Ordenes</Link>
                </nav>

                <div className="p-6 border-t border-gray-800">
                    <Link href="/" className="block px-4 py-2 text-center bg-gray-800 rounded hover:bg-gray-700 mb-2 text-sm">
                        ← Volver a la Tienda
                    </Link>
                    <SignOutButton>
                        <button className="w-full px-4 py-2 text-center bg-red-600 rounded hover:bg-red-700 text-sm font-semibold">
                            Cerrar Sesión
                        </button>
                    </SignOutButton>
                </div>
            </aside>
        </>
    )
}

export default HeaderAdmin