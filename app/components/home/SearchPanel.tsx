"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import { featuredProducts } from "../../constants/homeData";

const SearchPanel = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => {
        setQuery("");
        inputRef.current?.focus();
      }, 60);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const results = query.trim()
    ? featuredProducts.filter((p) =>
        p.nombre.toLowerCase().includes(query.trim().toLowerCase())
      )
    : featuredProducts.slice(0, 4);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-fashion-ink/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-2xl mx-auto mt-20 mx-4 sm:mx-auto bg-fashion-cream text-fashion-ink rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 border-b border-fashion-beige px-5 py-4">
              <Search className="w-5 h-5 text-fashion-mist shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Busca blusas, jeans, vestidos..."
                aria-label="Buscar productos"
                className="flex-1 bg-transparent outline-none text-lg placeholder:text-fashion-mist"
              />
              <button
                onClick={onClose}
                aria-label="Cerrar búsqueda"
                className="p-1.5 rounded-full hover:bg-fashion-beige text-fashion-mist"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-auto p-4">
              {results.length > 0 ? (
                <ul className="space-y-2">
                  {results.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/${p.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-4 p-2 rounded-2xl hover:bg-white transition-colors"
                      >
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-fashion-beige shrink-0">
                          <Image
                            src={p.imagenes[0]}
                            alt={p.nombre}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold truncate">{p.nombre}</p>
                          <p className="text-sm text-fashion-mist font-display font-bold">
                            ${p.precio.toLocaleString("es-CO")}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-fashion-mist py-8">
                  No encontramos resultados para “{query}”.
                </p>
              )}
            </div>

            <div className="border-t border-fashion-beige p-4">
              <Link
                href="/tienda"
                onClick={onClose}
                className="block w-full text-center bg-fashion-ink text-fashion-cream font-semibold py-3 rounded-2xl hover:bg-fashion-fuchsia transition-colors"
              >
                Ver tienda completa
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchPanel;
