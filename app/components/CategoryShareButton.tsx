"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  categoryName: string;
  categorySlug: string;
}

export default function CategoryShareButton({ categoryName, categorySlug }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/${categorySlug}`;

    try {
      // Intentar usar Web Share API (móvil)
      if (navigator.share) {
        await navigator.share({
          title: `${categoryName} - GaboShop`,
          text: `Mira estos productos de ${categoryName}`,
          url: url,
        });
        toast.success("¡Compartido!");
      } else {
        // Copiar al portapapeles (desktop)
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("¡Enlace copiado!");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error("Error al compartir:", error);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          ¡Copiado!
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          Compartir
        </>
      )}
    </button>
  );
}