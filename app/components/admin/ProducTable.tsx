"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Search, AlertTriangle, Pencil, Trash2, AlertCircle } from "lucide-react";
import { deleteProduct, searchProductsAdmin, lowStockProductsAdmin, getAllCategoriesAdmin } from "@/lib/firebase/admin";
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

  // Cargar categorías al montar
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
      
      console.log(`🔍 Buscando ${mode}: "${searchValue}"`); // ← Debug
      
      const data = await searchProductsAdmin(mode, searchValue);
      
      console.log(`✅ Encontrados ${data.length} productos`); // ← Debug
      
      setResults(data);

      if (data.length === 0) {
        toast.error(`No se encontraron productos con "${searchValue}"`, { icon: "🔍" });
      } else {
        toast.success(`${data.length} producto(s) encontrado(s)`, { icon: "✅" });
      }
    } catch (error) {
      console.error("Error buscando:", error);
      toast.error("Error buscando productos");
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
        toast.success("¡Todos los productos tienen buen stock!", { icon: "✅" });
      } else {
        toast(`${data.length} producto(s) con stock bajo`, { icon: "⚠️" });
      }
    } catch {
      toast.error("Error cargando productos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    // Notificación de confirmación mejorada
    toast((t) => (
      <div className="flex flex-col gap-3 max-w-md">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900 mb-1">¿Eliminar producto?</p>
            <p className="text-sm text-gray-600">
              Se eliminará <span className="font-semibold">"{name}"</span>
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
              setDeleting(id);
              
              try {
                await deleteProduct(id);
                setResults(prev => prev.filter(p => p.id !== id));
                
                toast.success(
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Trash2 className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">¡Producto eliminado!</p>
                      <p className="text-sm text-gray-600">"{name}" ya no existe</p>
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
              } catch {
                toast.error("Error eliminando producto");
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      {/* PANEL DE BÚSQUEDA */}
      <div className="bg-white border rounded-lg p-6 shadow-sm space-y-4">
        {/* Selector de modo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar por:
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setMode("nombre");
                setSelectedCategory("");
                setResults([]);
              }}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === "nombre"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Nombre
            </button>
            <button
              onClick={() => {
                setMode("categoria");
                setText("");
                setResults([]);
              }}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === "categoria"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Categoría
            </button>
          </div>
        </div>

        {/* Búsqueda por nombre */}
        {mode === "nombre" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del producto:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ej: iPhone, Laptop, etc."
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Buscar
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Busca en mayúsculas o minúsculas, funciona igual
            </p>
          </div>
        )}

        {/* Filtro por categoría */}
        {mode === "categoria" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecciona una categoría:
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    setResults([]);
                  }}
                  className={`p-3 rounded-lg border-2 font-medium transition-all ${
                    selectedCategory === cat.slug
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  {cat.titulo}
                </button>
              ))}
            </div>
            {selectedCategory && (
              <button
                onClick={handleSearch}
                disabled={loading}
                className="mt-3 w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Buscando..." : `Buscar en "${selectedCategory}"`}
              </button>
            )}
          </div>
        )}

        {/* Botón stock bajo */}
        <div className="pt-4 border-t">
          <button
            onClick={handleLowStock}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-orange-200 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50"
          >
            <AlertCircle className="w-4 h-4" />
            Ver productos con stock bajo (≤5)
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
      )}

      {/* RESULTADOS */}
      {!loading && results.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm">
          {/* DESKTOP */}
          <div className="hidden md:block divide-y">
            {results.map((p) => {
              const img = safeImage(p.imagenes?.[0]);

              return (
                <div key={p.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 border rounded-lg overflow-hidden bg-gray-100">
                      <Image src={img} alt={p.nombre} fill className="object-cover" unoptimized />
                    </div>

                    <div>
                      <p className="font-bold text-gray-900">{p.nombre}</p>
                      <p className="text-sm text-gray-600">
                        {p.precio.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}
                      </p>
                      <p className={`text-xs font-semibold ${p.stock > 5 ? "text-green-600" : "text-red-500"}`}>
                        Stock: {p.stock}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/studio/products/${p.slug}/edit`}
                      className="flex items-center gap-2 px-4 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                      Editar
                    </Link>

                    <button
                      onClick={() => handleDelete(p.id, p.nombre)}
                      disabled={deleting === p.id}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* MOBILE */}
          <div className="md:hidden divide-y">
            {results.map((p) => {
              const img = safeImage(p.imagenes?.[0]);

              return (
                <div key={p.id} className="p-4">
                  <div className="flex gap-3 mb-3">
                    <div className="relative w-20 h-20 border rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <Image src={img} alt={p.nombre} fill className="object-cover" unoptimized />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 line-clamp-2">{p.nombre}</p>
                      <p className="text-sm text-gray-600">
                        {p.precio.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}
                      </p>
                      <p className={`text-xs font-bold ${p.stock > 5 ? "text-green-600" : "text-red-500"}`}>
                        {p.stock} en stock
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/studio/products/${p.slug}/edit`}
                      className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                      Editar
                    </Link>

                    <button
                      onClick={() => handleDelete(p.id, p.nombre)}
                      disabled={deleting === p.id}
                      className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      {deleting === p.id ? "..." : "Eliminar"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SIN RESULTADOS */}
      {!loading && results.length === 0 && (
        <div className="bg-white rounded-lg border shadow-sm p-12 text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">Busca productos por nombre o categoría</p>
          <p className="text-sm text-gray-400">Los resultados aparecerán aquí</p>
        </div>
      )}
    </div>
  );
}