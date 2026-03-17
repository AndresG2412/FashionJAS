"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

interface Props {
  onSearch: (searchText: string) => void;
  isSearching?: boolean;
}

export default function SearchBar({ onSearch, isSearching = false }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    if (searchText.trim().length >= 2) {
      onSearch(searchText.trim());
    }
  };

  const handleClear = () => {
    setSearchText("");
    onSearch("");
    setIsOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="px-4">
      <p className="text-base font-serif font-semibold uppercase text-danashop-textPrimary tracking-wider mb-2">
        Buscar Producto
      </p>

      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center gap-2 px-3 py-2 border bg-eshop-goldLight/20 border-eshop-goldDeep rounded-lg hover:border-shop_light_green transition-colors text-gray-600"
        >
          <Search className="w-4 h-4" />
          <span className="text-base text-eshop-textPrimary">Buscar por nombre...</span>
        </button>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex bg-eshop-goldLight/20 items-center gap-2 px-3 py-2 border border-eshop-goldDeep rounded-lg">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ej: iPhone, Laptop..."
                autoFocus
                className="flex-1 outline-none text-eshop-textPrimary text-base"
              />
              {searchText && (
                <button
                  onClick={() => setSearchText("")}
                  className="p-1 hover:bg-eshop-textError rounded-full hoverEffect group"
                >
                  <X className="w-4 h-4 text-eshop-textSecondary group-hover:text-eshop-textDark hoverEffect" />
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              disabled={searchText.length < 2 || isSearching}
              className="px-4 py-2 bg-eshop-goldLight rounded-lg hover:bg-eshop-accent hoverEffect disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <Search className="w-4 h-4 text-eshop-textPrimary font-bold" />
            </button>
          </div>

          {/* <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">
              {searchText.length < 2
                ? "Mínimo 2 letras"
                : `Buscar "${searchText}"`}
            </span>
            <button
              onClick={handleClear}
              className="text-red-600 hover:underline"
            >
              Limpiar
            </button>
          </div> */}
        </div>
      )}
    </div>
  );
}