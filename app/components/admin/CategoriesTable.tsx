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

  const handleDelete = (categoryId: string, categoryTitle: string) => {
    toast((t) => (
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-10 h-10 bg-danashop-error/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-danashop-error" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-danashop-textPrimary mb-1 text-lg">¿Eliminar categoría?</p>
            <p className="text-sm text-danashop-textSecondary">
              Se eliminará <span className="font-bold text-danashop-brandSoft">"{categoryTitle}"</span>
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 text-sm font-bold text-danashop-textSecondary border border-danashop-borderColor rounded-lg hover:bg-danashop-hover transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              setDeleting(categoryId);
              try {
                await deleteCategory(categoryId);
                toast.success("Categoría eliminada", {
                  style: { background: '#1C182D', color: '#F3F4F6', border: '1px solid #2D2845' }
                });
                router.refresh();
              } catch (error: any) {
                toast.error("Error al eliminar");
              } finally {
                setDeleting(null);
              }
            }}
            className="px-4 py-2 text-sm font-black text-white bg-danashop-error rounded-lg hover:bg-red-700 transition-colors"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    ), { 
      style: { background: '#1C182D', color: '#F3F4F6', border: '1px solid #2D2845' },
      duration: Infinity 
    });
  };

  if (categories.length === 0) {
    return (
      <div className="bg-danashop-bgColorCard rounded-3xl border border-dashed border-danashop-borderColor p-12 text-center">
        <div className="p-6 bg-danashop-colorMain rounded-full w-fit mx-auto mb-4">
          <Tag className="w-12 h-12 text-danashop-brandSoft" strokeWidth={1} />
        </div>
        <p className="text-danashop-textSecondary mb-4 font-medium">No hay categorías registradas</p>
        <Link
          href="/studio/categories/new"
          className="text-danashop-brandSoft hover:text-danashop-brandMain font-black underline underline-offset-4 transition-colors"
        >
          Crear primera categoría
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-danashop-bgColorCard overflow-hidden mb-16">
      {/* VISTA DESKTOP */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border rounded-lg">
          <thead className="bg-danashop-colorMain/80 border-b border-danashop-borderColor">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-black text-danashop-textPrimary uppercase tracking-widest">
                Categoría
              </th>
              <th className="px-6 py-4 text-left text-xs font-black text-danashop-textPrimary uppercase tracking-widest">
                Slug
              </th>
              <th className="px-6 py-4 text-left text-xs font-black text-danashop-textPrimary uppercase tracking-widest">
                Descripción
              </th>
              <th className="px-6 py-4 text-center text-xs font-black text-danashop-textPrimary uppercase tracking-widest">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-danashop-borderColor">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-danashop-hover transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-danashop-brandMain/10 rounded-xl flex items-center justify-center shrink-0 border border-danashop-brandMain/20">
                      <Tag className="w-5 h-5 text-danashop-brandMain" />
                    </div>
                    <div>
                      <p className="font-bold text-danashop-textPrimary transition-colors">{category.titulo}</p>
                      <p className="text-[10px] font-mono text-danashop-textMuted uppercase tracking-tighter">ID: {category.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <code className="text-xs bg-danashop-colorMain px-2 py-1 rounded-md text-danashop-brandSoft font-bold border border-danashop-borderColor">
                    /{category.slug}
                  </code>
                </td>
                <td className="px-6 py-4 text-sm text-danashop-textSecondary max-w-xs truncate">
                  {category.descripcion || <span className="text-danashop-textMuted italic text-xs">Sin descripción</span>}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      href={`/studio/categories/${category.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-black text-danashop-textDark hover:text-danashop-textPrimary bg-danashop-brandSoft rounded-xl hover:bg-danashop-brandHover hoverEffect transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                      EDITAR
                    </Link>
                    <button
                      onClick={() => handleDelete(category.id, category.titulo)}
                      disabled={deleting === category.id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-black text-danashop-error bg-danashop-error/10 border border-danashop-error/20 rounded-xl hoverEffect hover:bg-danashop-error hover:text-white transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      {deleting === category.id ? '...' : 'ELIMINAR'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VISTA MÓVIL */}
      <div className="md:hidden grid gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-danashop-colorMain/50 border border-danashop-brandSoft rounded-lg p-5 hover:border-danashop-brandSoft/50 transition-all"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-danashop-brandMain/10 rounded-2xl flex items-center justify-center shrink-0 border border-danashop-brandMain/20">
                <Tag className="w-6 h-6 text-danashop-brandMain" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-danashop-textPrimary text-lg truncate uppercase tracking-tight">
                  {category.titulo}
                </h3>
                <code className="text-[10px] text-danashop-brandSoft font-bold uppercase">
                  Slug: {category.slug}
                </code>
              </div>
            </div>

            {category.descripcion && (
              <p className="text-sm text-danashop-textSecondary mb-5 bg-danashop-bgColorCard/50 p-3 rounded-xl border border-danashop-borderColor/50 line-clamp-2">
                {category.descripcion}
              </p>
            )}

            <div className="flex gap-3">
              <Link
                href={`/studio/categories/${category.id}/edit`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-black text-danashop-textDark bg-danashop-brandSoft rounded-xl hover:bg-danashop-brandMain transition-colors"
              >
                <Pencil className="w-4 h-4" />
                EDITAR
              </Link>
              <button
                onClick={() => handleDelete(category.id, category.titulo)}
                disabled={deleting === category.id}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-black text-danashop-error bg-danashop-error/10 border border-danashop-error/20 rounded-xl hover:bg-danashop-error hover:text-white transition-all"
              >
                <Trash2 className="w-4 h-4" />
                {deleting === category.id ? '...' : 'ELIMINAR'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer con total */}
      <div className="px-6 py-4 bg-danashop-colorMain/30 border-t border-danashop-borderColor">
        <p className="text-xs font-bold text-danashop-textMuted uppercase tracking-widest text-center md:text-left">
          Total: <span className="text-danashop-brandSoft">{categories.length}</span> {categories.length === 1 ? 'Categoría registrada' : 'Categorías registradas'}
        </p>
      </div>
    </div>
  );
}