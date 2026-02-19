import { currentUser, auth } from '@clerk/nextjs/server';

export default async function StudioDashboard() {
  const user = await currentUser();
  const { sessionClaims } = await auth();

  // DEBUG: Ver qué datos tiene la sesión
  console.log('User email:', user?.emailAddresses[0]?.emailAddress);
  console.log('Public metadata:', sessionClaims?.publicMetadata);
  console.log('Role:', (sessionClaims?.publicMetadata as { role?: string })?.role);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Welcome, {user?.firstName}! 👋
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
          <p className="text-3xl font-bold mt-2">4</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Revenue</h3>
          <p className="text-3xl font-bold mt-2">$0</p>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <a 
            href="/studio/products/new" 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add Product
          </a>
          <a 
            href="/studio/categories/new" 
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Add Category
          </a>
        </div>
      </div>
    </div>
  );
}