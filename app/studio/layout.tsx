import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { SignOutButton } from '@clerk/nextjs';

// Lista de emails admin
const ADMIN_EMAILS = ['cgaviria930@gmail.com'];

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  
  // Si no está logueado, redirige al login
  if (!userId) {
    redirect('/sign-in?redirect_url=/studio');
  }

  // Obtener email del usuario
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;

  // Verificar si es admin
  if (!email || !ADMIN_EMAILS.includes(email.toLowerCase())) {
    redirect('/?error=unauthorized');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white z-50">
        <div className="p-6">
          <h1 className="text-2xl font-bold">GaboShop Admin</h1>
          <p className="text-sm text-gray-400 mt-1">{user?.firstName}</p>
        </div>
        
        <nav className="mt-8">
          <Link 
            href="/studio" 
            className="block px-6 py-3 hover:bg-gray-800 transition"
          >
            📊 Dashboard
          </Link>
          <Link 
            href="/studio/products" 
            className="block px-6 py-3 hover:bg-gray-800 transition"
          >
            📦 Products
          </Link>
          <Link 
            href="/studio/categories" 
            className="block px-6 py-3 hover:bg-gray-800 transition"
          >
            🏷️ Categories
          </Link>
          <Link 
            href="/studio/orders" 
            className="block px-6 py-3 hover:bg-gray-800 transition"
          >
            🛒 Orders
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800">
          <Link 
            href="/" 
            className="block px-4 py-2 text-center bg-gray-800 rounded hover:bg-gray-700 mb-2"
          >
            ← Back to Store
          </Link>
          <SignOutButton>
            <button className="w-full px-4 py-2 text-center bg-red-600 rounded hover:bg-red-700">
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}