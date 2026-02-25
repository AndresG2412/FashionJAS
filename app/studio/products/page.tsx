import Link from 'next/link'
import { Plus } from 'lucide-react'
import ProductsTable from '@/app/components/admin/ProducTable'

export default function ProductsPage() {
  return (
    <div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-center md:text-start text-3xl font-bold">
          Productos
        </h1>

        <Link
          href="/studio/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5"/>
          Nuevo Producto
        </Link>
      </div>

      {/* ahora el componente maneja búsqueda */}
      <ProductsTable/>

    </div>
  )
}