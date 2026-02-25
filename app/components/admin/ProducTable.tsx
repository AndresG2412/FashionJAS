"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import { deleteProduct } from '@/lib/firebase/admin';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import type { Productos } from '@/lib/firebase/products';

interface Props {
  products: Productos[];
}

export default function ProductsTable({ products }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`¿Estás seguro de eliminar "${productName}"?`)) return;

    setDeleting(productId);
    try {
      await deleteProduct(productId);
      toast.success('Producto eliminado');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Error al eliminar producto');
    } finally {
      setDeleting(null);
    }
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center border border-dashed">
        <p className="text-gray-500 mb-4">No hay productos registrados</p>
        <Link href="/studio/products/new" className="text-blue-600 font-medium hover:underline">
          Crear primer producto
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 border-b text-gray-600 font-semibold uppercase">
          <tr>
            <th className="px-6 py-4">Producto</th>
            <th className="px-6 py-4 text-center">Precio</th>
            <th className="px-6 py-4 text-center">Stock</th>
            <th className="px-6 py-4 text-center">Categorías</th>
            <th className="px-6 py-4 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 transition-colors">

              {/* Info del Producto */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded border bg-gray-50 overflow-hidden shrink-0">
                    <Image
                      src={product.imagenes?.[0] || '/placeholder.png'}
                      alt={product.nombre}
                      fill
                      className="object-cover"
                      unoptimized // 🔥 Crucial para que Cloudinary no de error 400
                    />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{product.nombre}</p>
                    <p className="text-xs text-gray-500">{product.categorias?.[0]}</p>
                  </div>
                </div>
              </td>

              {/* Precio*/}
              <td className="px-6 py-4 text-center">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900">
                    {product.precio.toLocaleString('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                      minimumFractionDigits: 0,
                    })}
                  </span>
                </div>
              </td>

              {/*Stock*/}
              <td className="px-6 py-4 text-center">
                <div className="flex flex-col">
                  <span className={`text-[10px] font-bold uppercase mt-1 ${
                    product.stock > 5 ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {product.stock} en stock
                  </span>
                </div>
              </td>

              {/* Categorías */}
              <td className="px-6 py-4 flex align-middle items-center justify-center">
                <div className="flex flex-wrap gap-1">
                  {product.categorias.map((cat, i) => (
                    <span key={i} className="bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded border border-blue-100">
                      {cat}
                    </span>
                  ))}
                </div>
              </td>

              {/* Acciones */}
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-3">
                  <Link
                    href={`/studio/products/${product.id}`} // 🔥 Asegúrate que la carpeta sea [id]
                    className="border-2 px-4 rounded-lg py-2 flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    <span>Editar</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id, product.nombre)}
                    disabled={deleting === product.id}
                    className="border-2 px-4 rounded-lg py-2 flex items-center gap-1 text-red-500 hover:text-red-700 font-medium disabled:opacity-30 transition-colors"
                  >
                    {deleting === product.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    <span>Eliminar</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}