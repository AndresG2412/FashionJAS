"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Pencil, Trash2, Eye } from 'lucide-react';
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
      toast.error('Error al eliminar producto');
    } finally {
      setDeleting(null);
    }
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-gray-500 mb-4">No hay productos registrados</p>
        <Link
          href="/studio/products/new"
          className="text-blue-600 hover:underline"
        >
          Crear primer producto
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Producto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Precio
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Categorías
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded overflow-hidden border">
                    <Image
                      src={product.imagenes[0]}
                      alt={product.nombre}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.nombre}</p>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {product.descripcion}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {product.precio.toLocaleString('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0,
                })}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    product.stock > 10
                      ? 'bg-green-100 text-green-800'
                      : product.stock > 0
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.stock} unidades
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {product.categorias.join(', ')}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/product/${product.slug}`}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title="Ver"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/studio/products/${product.id}/edit`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id, product.nombre)}
                    disabled={deleting === product.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
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