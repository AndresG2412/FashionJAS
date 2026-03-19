"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Search, AlertTriangle, Pencil, Trash2, AlertCircle, Package } from "lucide-react";
import { deleteProduct, searchProductsAdmin, lowStockProductsAdmin, getAllCategoriesAdmin, getAllProductsAdmin } from "@/lib/firebase/admin";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import type { Productos } from "@/lib/firebase/products";
import type { Category } from "@/lib/firebase/categories";

const safeImage = (url?: string) => {
  if (!url || typeof url !== "string") return "/placeholder.png";
  try {
    return encodeURI(url.replace("http://", "https://"));
  } catch {
    return "/placeholder.png";
  }
};

export default function ProductsTable() {
  const router = useRouter();

  const [mode, setMode] = useState<"nombre" | "categoria">("nombre");
  const [text, setText] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [results, setResults] = useState<Productos[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const categoriesPerPage = 6;

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const cats = await getAllCategoriesAdmin();
    setCategories(cats);
  };

  const handleSearch = async () => {
    if (mode === "nombre" && text.trim().length < 2) {
      toast.error("Escribe al menos 2 letras para buscar");
      return;
    }
    if (mode === "categoria" && !selectedCategory) {
      toast.error("Selecciona una categoría");
      return;
    }

    setLoading(true);
    try {
      const searchValue = mode === "nombre" ? text : selectedCategory;
      const data = await searchProductsAdmin(mode, searchValue);
      setResults(data);

      if (data.length === 0) {
        toast.error(`No se encontraron productos`, { icon: "🔍" });
      } else {
        toast.success(`${data.length} producto(s) encontrado(s)`, { icon: "✅" });
      }
    } catch (error) {
      toast.error("Error buscando productos");
    } finally {
      setLoading(false);
    }
  };

  const handleShowAll = async () => {
    setLoading(true);
    try {
      const data = await getAllProductsAdmin();
      setResults(data);
      toast.success(`${data.length} productos cargados`, { icon: "📦" });
    } catch {
      toast.error("Error cargando productos");
    } finally {
      setLoading(false);
    }
  };

  const handleLowStock = async () => {
    setLoading(true);
    try {
      const data = await lowStockProductsAdmin();
      setResults(data);
      if (data.length === 0) {
        toast.success("¡Stock saludable!", { icon: "✅" });
      } else {
        toast(`${data.length} productos con stock bajo`, { icon: "⚠️" });
      }
    } catch {
      toast.error("Error cargando productos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3 max-w-md bg-eshop-bgWhite p-1 ">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-10 h-10 bg-eshop-accent/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-eshop-accent" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-eshop-textPrimary mb-1 text-base">¿Eliminar producto?</p>
            <p className="text-sm text-eshop-textSecondary">
              Se eliminará <span className="font-bold text-eshop-textPrimary">"{name}"</span> permanentemente.
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-eshop-textSecondary bg-eshop-bgCard rounded-lg hover:bg-eshop-borderSubtle transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              setDeleting(id);
              try {
                await deleteProduct(id);
                setResults(prev => prev.filter(p => p.id !== id));
                toast.success("Producto eliminado correctamente");
                router.refresh();
              } catch {
                toast.error("Error eliminando producto");
              } finally {
                setDeleting(null);
              }
            }}
            className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    ), { duration: Infinity, position: 'top-center' });
  };

  // Clases de estilo para botones de modo
  const modeBtnActive = "bg-eshop-accent text-eshop-textDark border-eshop-accent shadow-md";
  const modeBtnInactive = "bg-eshop-bgWhite text-eshop-textSecondary border-eshop-borderSubtle hover:bg-eshop-bgCard";

  return (
    <div className="space-y-8">
      {/* ── PANEL DE BÚSQUEDA ── */}
      <div className="bg-eshop-bgWhite border border-eshop-textSecondary rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <label className="block font-serif text-base font-semibold text-eshop-textSecondary uppercase tracking-wider mb-3">
            Buscar por:
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => { setMode("nombre"); setSelectedCategory(""); setResults([]); }}
              className={`flex-1 hidden md:block px-4 py-3 rounded-xl font-bold text-sm tracking-wide hoverEffect border ${mode === "nombre" ? modeBtnActive : modeBtnInactive}`}
            >
              Nombre del Producto
            </button>
            <button
              onClick={() => { setMode("nombre"); setSelectedCategory(""); setResults([]); }}
              className={`flex-1 px-2 md:hidden block py-3 rounded-xl font-bold text-sm hoverEffect border ${mode === "nombre" ? modeBtnActive : modeBtnInactive}`}
            >
              Nombre
            </button>
            <button
              onClick={() => { setMode("categoria"); setText(""); setResults([]); }}
              className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm hoverEffect tracking-wide border ${mode === "categoria" ? modeBtnActive : modeBtnInactive}`}
            >
              Categoría
            </button>
          </div>
        </div>

        {mode === "nombre" && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="block text-xs font-semibold text-eshop-textSecondary uppercase tracking-widest mb-3">
              Nombre del producto:
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Ej: Vestido Dorado, Bolso Piel..."
                className="flex-1 bg-eshop-bgCard text-eshop-textPrimary placeholder:text-eshop-textDisabled border border-eshop-borderSubtle rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-eshop-accent/20 focus:border-eshop-accent hoverEffect"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-8 py-3 bg-eshop-buttonBase text-eshop-textDark rounded-xl hover:bg-eshop-buttonHover font-semibold text-xs uppercase tracking-widest flex items-center gap-2 disabled:opacity-50 shadow-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span className="hidden md:block">Buscar</span>
              </button>
            </div>
          </div>
        )}

        {mode === "categoria" && (
  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
    <div className="flex justify-between items-end mb-3">
      <label className="block text-xs font-black text-eshop-textSecondary uppercase tracking-widest">
        Selecciona una categoría:
      </label>
      {/* Indicador de página */}
      <span className="text-[10px] font-bold text-eshop-accent uppercase tracking-tighter">
        Pág. {currentPage + 1} de {Math.ceil(categories.length / categoriesPerPage)}
      </span>
    </div>

    {/* Grid de Categorías con botones uniformes */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {categories
        .slice(currentPage * categoriesPerPage, (currentPage + 1) * categoriesPerPage)
        .map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCategory(cat.slug); setResults([]); }}
            title={cat.titulo} // Tooltip para ver el nombre completo si está truncado
            className={`h-12 md:h-14 px-3 rounded-xl border-2 text-[10px] md:text-sm font-semibold uppercase tracking-wide transition-all flex items-center justify-center text-center leading-tight ${
              selectedCategory === cat.slug
                ? "border-eshop-accent bg-eshop-accent/10 text-eshop-accent shadow-sm"
                : "border-eshop-borderSubtle bg-eshop-bgWhite text-eshop-textSecondary hover:border-eshop-accent/40"
            }`}
          >
            <span className="truncate block w-full">
              {cat.titulo}
            </span>
          </button>
        ))}
    </div>

    {/* Controles de Paginación */}
    {categories.length > categoriesPerPage && (
      <div className="flex gap-2 mt-4 justify-center md:justify-end">
        <button
          disabled={currentPage === 0}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest bg-eshop-bgCard text-eshop-textSecondary rounded-lg border border-eshop-borderSubtle disabled:opacity-30 hover:bg-eshop-borderSubtle transition-colors"
        >
          Anterior
        </button>
        <button
          disabled={(currentPage + 1) * categoriesPerPage >= categories.length}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider bg-eshop-bgCard text-eshop-textSecondary rounded-lg border border-eshop-borderSubtle disabled:opacity-30 hover:bg-eshop-borderSubtle transition-colors"
        >
          Siguiente
        </button>
      </div>
    )}

    {selectedCategory && (
      <button
        onClick={handleSearch}
        disabled={loading}
        className="mt-6 w-full px-6 py-3 bg-eshop-buttonBase font-semibold text-sm uppercase tracking-widest text-eshop-textDark rounded-xl hover:bg-eshop-buttonHover hoverEffect shadow-md transition-all active:scale-[0.98]"
      >
        {loading ? "Procesando..." : `Explorar en "${selectedCategory}"`}
      </button>
    )}
  </div>
)}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-eshop-borderSubtle">
          <button
            onClick={handleShowAll}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-3 border border-eshop-borderSubtle bg-eshop-bgCard text-eshop-textPrimary text-xs font-semibold uppercase tracking-widest rounded-xl hover:bg-eshop-borderSubtle hoverEffect disabled:opacity-50"
          >
            <Package className="w-4 h-4 text-eshop-accent" />
            Todos los productos
          </button>
          <button
            onClick={handleLowStock}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-3 border border-red-200 bg-red-50 text-red-700 text-xs font-semibold uppercase tracking-widest rounded-xl hover:bg-red-100 hoverEffect disabled:opacity-50"
          >
            <AlertCircle className="w-4 h-4" />
            Stock Bajo (≤5)
          </button>
        </div>
      </div>

      {/* ── RESULTADOS ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
          <Loader2 className="w-10 h-10 animate-spin text-eshop-accent mb-4" />
          <p className="text-eshop-textSecondary font-bold uppercase tracking-widest text-xs">Cargando inventario...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="bg-eshop-bgWhite rounded-2xl border border-eshop-borderSubtle overflow-hidden shadow-sm">
          <div className="divide-y divide-eshop-borderSubtle">
            {results.map((p) => (
              <div key={p.id} className="p-5 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-eshop-bgCard/30 transition-colors">
                <div className="flex items-center gap-5 w-full md:w-auto">
                  <div className="relative w-20 h-20 shrink-0 border border-eshop-borderSubtle rounded-xl overflow-hidden bg-eshop-bgCard shadow-inner">
                    <Image src={safeImage(p.imagenes?.[0])} alt={p.nombre} fill className="object-cover" unoptimized />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-eshop-textPrimary text-lg leading-tight mb-1 truncate">{p.nombre}</p>
                    <p className="text-eshop-accent font-bold text-sm mb-1">
                      {p.precio.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${p.stock > 5 ? "bg-green-500" : "bg-red-500"}`} />
                      <p className={`text-[10px] font-semibold uppercase tracking-widest ${p.stock > 5 ? "text-green-600" : "text-red-500"}`}>
                        Stock: {p.stock} unidades
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 w-full md:w-80">
                  <Link
                    href={`/studio/products/${p.slug}/edit`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-black text-eshop-textDark bg-eshop-buttonBase rounded-xl hover:bg-eshop-buttonHover hoverEffect"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    EDITAR
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id, p.nombre)}
                    disabled={deleting === p.id}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-black text-eshop-textDark bg-eshop-cancelCart/80 hover:bg-eshop-cancelCartHover rounded-xl transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {deleting === p.id ? "..." : "ELIMINAR"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-eshop-bgCard/50 rounded-3xl border border-dashed border-eshop-borderEmphasis p-16 text-center">
          <div className="bg-eshop-bgWhite w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Search className="w-8 h-8 text-eshop-textDisabled" strokeWidth={1.5} />
          </div>
          <h3 className="text-eshop-textPrimary font-semibold text-xl mb-2">Sin resultados</h3>
          <p className="text-eshop-textSecondary text-sm max-w-xs mx-auto">
            Utiliza los filtros superiores para gestionar tu catálogo de productos.
          </p>
        </div>
      )}
    </div>
  );
}