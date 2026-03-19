"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Tag, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
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

  // 🔹 LÓGICA DE PAGINACIÓN
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);

  const paginatedCategories = categories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDelete = (categoryId: string, categoryTitle: string) => {
    toast((t) => (
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-10 h-10 bg-eshop-textError rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-eshop-textDark" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-eshop-textDark mb-1 text-lg">¿Eliminar categoría?</p>
            <p className="text-sm text-eshop-textDark">
              Se eliminará <span className="font-bold text-eshop-goldLight">"{categoryTitle}"</span>
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 text-sm font-semibold text-eshop-textDark bg-eshop-cancelCart hover:bg-eshop-cancelCartHover hoverEffect rounded-lg"
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              setDeleting(categoryId);
              try {
                await deleteCategory(categoryId);
                toast.success("Categoría eliminada");
                router.refresh();
                if (paginatedCategories.length === 1 && currentPage > 1) {
                    setCurrentPage(prev => prev - 1);
                }
              } catch (error: any) {
                toast.error("Error al eliminar");
              } finally {
                setDeleting(null);
              }
            }}
            className="px-4 py-2 text-sm font-semibold bg-eshop-bgCard text-eshop-goldDeep rounded-lg hover:text-eshop-textDark hover:bg-eshop-buttonHover hoverEffect"
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

  return (
      <div className="bg-eshop-bgCard overflow-hidden mb-16">
        {/* VISTA DESKTOP */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border border-eshop-textSecondary">
            <thead className="bg-eshop-formsBackground border-b border-eshop-textSecondary">
              <tr>
                <th className="font-serif px-6 py-4 text-left text-xs font-semibold text-eshop-textPrimary uppercase tracking-widest">Categoría</th>
                <th className="font-serif px-6 py-4 text-left text-xs font-semibold text-eshop-textPrimary uppercase tracking-widest">Slug</th>
                <th className="font-serif px-6 py-4 text-left text-xs font-semibold text-eshop-textPrimary uppercase tracking-widest">Descripción</th>
                <th className="font-serif px-6 py-4 text-center text-xs font-semibold text-eshop-textPrimary uppercase tracking-widest">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-eshop-accent">
              {paginatedCategories.map((category) => (
                <tr key={category.id} className="hover:bg-eshop-goldLight/20 hoverEffect group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-eshop-goldLight/30 rounded-xl flex items-center justify-center shrink-0 border border-eshop-goldDeep">
                        <Tag className="w-5 h-5 text-eshop-goldDeep" />
                      </div>
                      <div>
                        <p className="font-bold text-eshop-textPrimary">{category.titulo}</p>
                        <p className="text-[10px] font-mono text-eshop-textSecondary uppercase">ID: {category.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs bg-eshop-goldLight/30 px-2 py-1 rounded-md text-eshop-textPrimary font-semibold border border-eshop-goldDeep">
                      /{category.slug}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-sm text-eshop-textSecondary max-w-xs truncate font-serif">
                    {category.descripcion || <span className="italic text-xs">Sin descripción</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/studio/categories/${category.id}/edit`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-black text-eshop-textDark bg-eshop-buttonBase hover:bg-eshop-buttonHover rounded-xl"
                      >
                        <Pencil className="w-4 h-4" /> EDITAR
                      </Link>
                      <button
                        onClick={() => handleDelete(category.id, category.titulo)}
                        disabled={deleting === category.id}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-black text-eshop-textDark bg-eshop-cancelCart/80 hover:bg-eshop-cancelCartHover rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" /> {deleting === category.id ? '...' : 'ELIMINAR'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* VISTA MÓVIL */}
        <div className="md:hidden grid gap-4 p-4">
          {paginatedCategories.map((category) => (
            <div
              key={category.id}
              className="bg-eshop-formsBackground border border-eshop-textSecondary rounded-lg p-5 hover:border-eshop-goldDeep/50"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-eshop-goldLight/20 rounded-2xl flex items-center justify-center shrink-0 border border-eshop-goldDeep/30">
                  <Tag className="w-6 h-6 text-eshop-goldDeep" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-eshop-textPrimary text-lg truncate uppercase tracking-wide">
                    {category.titulo}
                  </h3>
                  <code className="text-[10px] text-eshop-goldDeep font-bold uppercase">
                    Slug: {category.slug}
                  </code>
                </div>
              </div>

              {category.descripcion && (
                <p className="text-sm text-eshop-textSecondary mb-5 bg-eshop-bgCard/50 p-3 rounded-xl border border-eshop-accent/30 line-clamp-2 font-serif">
                  {category.descripcion}
                </p>
              )}

              <div className="flex gap-3">
                <Link
                  href={`/studio/categories/${category.id}/edit`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-black text-eshop-textDark bg-eshop-buttonBase rounded-xl hover:bg-eshop-buttonHover hoverEffect"
                >
                  <Pencil className="w-4 h-4" />
                  EDITAR
                </Link>
                <button
                  onClick={() => handleDelete(category.id, category.titulo)}
                  disabled={deleting === category.id}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-black text-eshop-textDark bg-eshop-cancelCart/80 hover:bg-eshop-cancelCartHover rounded-xl transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  {deleting === category.id ? '...' : 'ELIMINAR'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER DE PAGINACIÓN (Global para ambas vistas) */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-eshop-formsBackground border-t border-eshop-textSecondary">
            <button
              onClick={() => {
                  setCurrentPage((prev) => Math.max(prev - 1, 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-eshop-textDark bg-eshop-buttonBase border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> 
              <span className="hidden sm:inline">Anterior</span>
            </button>

            <span className="text-sm font-semibold text-eshop-textPrimary">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => {
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-eshop-textDark bg-eshop-buttonBase border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Footer con total */}
        <div className="px-6 py-4 bg-eshop-formsBackground/50 border-t border-eshop-textSecondary">
          <p className="text-xs font-bold text-eshop-textSecondary uppercase tracking-widest text-center md:text-left">
            Total: <span className="text-eshop-goldDeep">{categories.length}</span> {categories.length === 1 ? 'Categoría registrada' : 'Categorías registradas'}
          </p>
        </div>
      </div>
  );
}