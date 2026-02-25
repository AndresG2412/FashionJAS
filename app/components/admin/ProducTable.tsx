"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Search } from "lucide-react";
import { deleteProduct, searchProductsAdmin, lowStockProductsAdmin } from "@/lib/firebase/admin";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import type { Productos } from "@/lib/firebase/products";

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

  const [mode,setMode]=useState<"nombre"|"categoria">("nombre");
  const [text,setText]=useState("");
  const [results,setResults]=useState<Productos[]>([]);
  const [loading,setLoading]=useState(false);
  const [deleting,setDeleting]=useState<string|null>(null);

  const handleSearch=async()=>{
    if(!text) return;

    setLoading(true);

    try{
      const data=await searchProductsAdmin(mode,text);
      setResults(data);
    }catch{
      toast.error("Error buscando productos");
    }finally{
      setLoading(false);
    }
  };

  const handleLowStock=async()=>{
    setLoading(true);

    try{
      const data=await lowStockProductsAdmin();
      setResults(data);
    }catch{
      toast.error("Error cargando poco stock");
    }finally{
      setLoading(false);
    }
  };

  const handleDelete=async(id:string,name:string)=>{
    if(!confirm(`Eliminar ${name}?`)) return;

    setDeleting(id);

    try{
      await deleteProduct(id);
      setResults(prev=>prev.filter(p=>p.id!==id));
      toast.success("Eliminado");
      router.refresh();
    }catch{
      toast.error("Error eliminando");
    }finally{
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">

      {/* BUSCADOR */}
      <div className="bg-white border rounded-lg p-4 flex flex-col md:flex-row gap-3">

        <select
          value={mode}
          onChange={e=>setMode(e.target.value as any)}
          className="border rounded px-3 py-2"
        >
          <option value="nombre">Nombre</option>
          <option value="categoria">Categoría</option>
        </select>

        <input
          value={text}
          onChange={e=>setText(e.target.value)}
          placeholder="Buscar..."
          className="flex-1 border rounded px-3 py-2"
        />

        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2"
        >
          <Search className="w-4 h-4"/>
          Buscar
        </button>

        <button
          onClick={handleLowStock}
          className="px-4 py-2 border rounded"
        >
          Poco stock
        </button>

      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin"/>
        </div>
      )}

      {/* RESULTADOS */}
      {!loading && results.length>0 && (
        <div className="bg-white rounded-lg border">

          {/* DESKTOP */}
          <div className="hidden md:block divide-y">
            {results.map(p=>{
              const img=safeImage(p.imagenes?.[0]);

              return(
                <div key={p.id} className="p-4 flex items-center justify-between">

                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 border rounded overflow-hidden">
                      <Image src={img} alt={p.nombre} fill className="object-cover" unoptimized/>
                    </div>

                    <div>
                      <p className="font-bold">{p.nombre}</p>
                      <p className="text-sm text-gray-500">
                        {p.precio.toLocaleString('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:0})}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/studio/products/${p.id}`} className="border px-3 py-1 rounded">
                      Editar
                    </Link>

                    <button
                      onClick={()=>handleDelete(p.id,p.nombre)}
                      className="border px-3 py-1 rounded text-red-500"
                    >
                      Eliminar
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {/* MOBILE — tu card reciclada */}
          <div className="md:hidden divide-y">
            {results.map(p=>{
              const img=safeImage(p.imagenes?.[0]);

              return(
                <div key={p.id} className="p-4">

                  <div className="flex gap-3">
                    <div className="relative w-20 h-20 border rounded overflow-hidden">
                      <Image src={img} alt={p.nombre} fill className="object-cover" unoptimized/>
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold">{p.nombre}</p>
                      <p className="text-sm text-gray-500">
                        {p.precio.toLocaleString('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:0})}
                      </p>
                      <p className={`text-xs font-bold ${p.stock>5?'text-green-600':'text-red-500'}`}>
                        {p.stock} en stock
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-3">
                    <Link href={`/studio/products/${p.id}`} className="flex-1 border rounded py-2 text-center text-blue-600">
                      Editar
                    </Link>

                    <button
                      onClick={()=>handleDelete(p.id,p.nombre)}
                      className="flex-1 border rounded py-2 text-center text-red-500"
                    >
                      Eliminar
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {!loading && results.length===0 && (
        <p className="text-center text-gray-400 py-10">
          No hay resultados
        </p>
      )}

    </div>
  );
}