"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Tag, AlertTriangle } from 'lucide-react';
import { deleteCategory } from '@/lib/firebase/admin';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import type { Category } from '@/lib/firebase/categories';

interface Props {
  categories: Category[];
}

export default function CategoriesTable({ categories }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (categoryId: string, categoryTitle: string) => {
    // Notificación de confirmación mejorada
    toast((t) => (
      <div className="flex flex-col gap-3 max-w-md">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900 mb-1">¿Eliminar categoría?</p>
            <p className="text-sm text-gray-600">
              Se eliminará <span className="font-semibold">"{categoryTitle}"</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Los productos asociados no se eliminarán
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              setDeleting(categoryId);
              
              try {
                await deleteCategory(categoryId);
                
                // Toast de éxito mejorado
                toast.success(
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Trash2 className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">¡Categoría eliminada!</p>
                      <p className="text-sm text-gray-600">"{categoryTitle}" ya no existe</p>
                    </div>
                  </div>,
                  {
                    duration: 4000,
                    style: {
                      background: '#fff',
                      padding: '16px',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    },
                  }
                );
                
                router.refresh();
              } catch (error: any) {
                toast.error(
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Error al eliminar</p>
                      <p className="text-sm text-gray-600">{error.message || 'Intenta de nuevo'}</p>
                    </div>
                  </div>,
                  {
                    duration: 4000,
                    style: {
                      background: '#fff',
                      padding: '16px',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    },
                  }
                );
              } finally {
                setDeleting(null);
              }
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
      style: {
        background: '#fff',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        border: '1px solid #fee2e2',
      },
    });
  };

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 mb-4">No hay categorías registradas</p>
        <Link
          href="/studio/categories/new"
          className="text-green-600 hover:underline font-medium"
        >
          Crear primera categoría
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* VISTA DESKTOP - Tabla */}
        <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 border-b">
                    <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        ID / Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Descripción
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Acciones
                    </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                            <Tag className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                            <p className="font-bold text-gray-900">{category.titulo}</p>
                            <p className="text-xs text-gray-500">ID: {category.id}</p>
                            </div>
                        </div>
                        </td>
                        <td className="px-6 py-4">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">
                            {category.slug}
                        </code>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                        {category.descripcion || (
                            <span className="text-gray-400 italic">Sin descripción</span>
                        )}
                        </td>
                        <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <Link
                            href={`/studio/categories/${category.id}/edit`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                            >
                            <Pencil className="w-4 h-4" />
                            </Link>
                            <button
                            onClick={() => handleDelete(category.id, category.titulo)}
                            disabled={deleting === category.id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* VISTA MÓVIL - Cards Separadas */}
        <div className="md:hidden flex flex-col gap-4 bg-gray-50">
            {categories.map((category) => (
            <div
                key={category.id}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition-all active:scale-[0.98]"
            >
                <div className="flex items-start gap-3 mb-3">
                    {/* Icono */}
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                        <Tag className="w-6 h-6 text-green-600" />
                    </div>

                    {/* Contenedor principal ajustado */}
                    <div className="flex flex-1 justify-between items-start min-w-0"> 
                        <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 text-lg truncate">
                                {category.titulo}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">ID: {category.id}</p>
                        </div>
                        
                        <div className="shrink-0">
                            <code className="inline-block text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">
                                {category.slug}
                            </code>
                        </div>
                    </div>
                </div>

                {category.descripcion && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 bg-gray-50 p-2 rounded-lg">
                        {category.descripcion}
                    </p>
                )}

                <div className="flex gap-3">
                    <Link
                        href={`/studio/categories/${category.id}/edit`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        <Pencil className="w-4 h-4" />
                        Editar
                    </Link>
                    <button
                        onClick={() => handleDelete(category.id, category.titulo)}
                        disabled={deleting === category.id}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                        <Trash2 className="w-4 h-4" />
                        {deleting === category.id ? '...' : 'Eliminar'}
                    </button>
                </div>
            </div>
            ))}
        </div>

        {/* Footer con total */}
        <div className="px-4 md:px-6 py-4 bg-gray-50 border-t mb-16">
            <p className="text-sm text-gray-600">
                Total: <span className="font-bold">{categories.length}</span> categoría{categories.length !== 1 ? 's' : ''}
            </p>
        </div>
    </div>
  );
}