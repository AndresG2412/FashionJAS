"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { createProduct, updateProduct } from '@/lib/firebase/admin';
import type { Category } from '@/lib/firebase/categories';
import type { Productos } from '@/lib/firebase/products';
import toast from 'react-hot-toast';
import { Loader2, Upload, X } from 'lucide-react';
import Image from 'next/image';

// ─── Tipos y constantes de tallas ───────────────────────────────────────────
type TipoTalla = "ropa" | "calzado" | "unica" | "ninguna";

const TALLAS_ROPA = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const TALLAS_CALZADO = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"];

const TIPO_TALLA_CONFIG: Record<TipoTalla, { label: string; icon: string; descripcion: string }> = {
  ninguna: { label: "Sin tallas",   icon: "📵", descripcion: "Celulares, electrónicos, accesorios" },
  ropa:    { label: "Ropa",         icon: "👕", descripcion: "Camisas, pantalones, vestidos…"       },
  calzado: { label: "Calzado",      icon: "👟", descripcion: "Zapatos, zapatillas, botas…"          },
  unica:   { label: "Talla única",  icon: "🔄", descripcion: "Trajes elásticos, gorras…"            },
};

// ─── Helpers ────────────────────────────────────────────────────────────────
const safeImage = (url?: string) => {
  if (!url || typeof url !== "string") return "/placeholder.png";
  try {
    return encodeURI(url.replace("http://", "https://"));
  } catch {
    return "/placeholder.png";
  }
};

const detectarTipoTalla = (tallas?: string[]): TipoTalla => {
  if (!tallas || tallas.length === 0) return "ninguna";
  if (tallas.includes("única")) return "unica";
  if (tallas.some(t => TALLAS_CALZADO.includes(t))) return "calzado";
  return "ropa";
};

// ─── Props ──────────────────────────────────────────────────────────────────
interface Props {
  categories: Category[];
  product?: Productos & { id: string };
  isEditing?: boolean;
}

// ────────────────────────────────────────────────────────────────────────────
export default function ProductForm({ categories, product, isEditing = false }: Props) {
  const router = useRouter();
  const [loading, setLoading]   = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    nombre:     product?.nombre     || '',
    slug:       product?.slug       || '',
    precio:     product?.precio     || 0,
    descripcion:product?.descripcion|| '',
    variante:   product?.variante   || '',
    categorias: product?.categorias || [],
    stock:      product?.stock      || 0,
    imagenes:   product?.imagenes   || [],
    tallas:     product?.tallas     || [],
  });

  const [tipoTalla, setTipoTalla] = useState<TipoTalla>(
    () => detectarTipoTalla(product?.tallas)
  );

  // ── Slug automático ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!isEditing && formData.nombre) {
      const slug = formData.nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.nombre, isEditing]);

  // ── Handlers generales ───────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'precio' || name === 'stock' ? Number(value) : value,
    }));
  };

  const handleCategoryChange = (categorySlug: string) => {
    setFormData(prev => {
      const categorias = prev.categorias.includes(categorySlug)
        ? prev.categorias.filter(c => c !== categorySlug)
        : [...prev.categorias, categorySlug];
      return { ...prev, categorias };
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  // ── Handlers de tallas ───────────────────────────────────────────────────
  const handleTipoTallaChange = (tipo: TipoTalla) => {
    setTipoTalla(tipo);
    if (tipo === "unica") {
      setFormData(prev => ({ ...prev, tallas: ["única"] }));
    } else {
      setFormData(prev => ({ ...prev, tallas: [] }));
    }
  };

  const handleTallaToggle = (talla: string) => {
    setFormData(prev => {
      const tallas = prev.tallas.includes(talla)
        ? prev.tallas.filter(t => t !== talla)
        : [...prev.tallas, talla];
      return { ...prev, tallas };
    });
  };

  // ── Upload de imágenes ───────────────────────────────────────────────────
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} es demasiado grande (máx. 5MB)`);
          continue;
        }
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} no es una imagen válida`);
          continue;
        }

        const fd = new FormData();
        fd.append('file', file);
        fd.append('upload_preset', 'gaboshop');

        try {
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/duwosb0hu/image/upload`,
            { method: 'POST', body: fd }
          );
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          if (data.secure_url && typeof data.secure_url === 'string') {
            uploadedUrls.push(data.secure_url);
          } else {
            toast.error(`Error al subir ${file.name}`);
          }
        } catch (uploadError) {
          console.error('Error uploading file:', file.name, uploadError);
          toast.error(`No se pudo subir ${file.name}`);
        }
      }

      if (uploadedUrls.length > 0) {
        setFormData(prev => ({ ...prev, imagenes: [...prev.imagenes, ...uploadedUrls] }));
        toast.success(`${uploadedUrls.length} imagen(es) subida(s)`);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Error al subir imágenes');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, imagenes: prev.imagenes.filter((_, i) => i !== index) }));
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim())          { toast.error('El nombre es obligatorio');           return; }
    if (!formData.slug.trim())            { toast.error('El slug es obligatorio');              return; }
    if (formData.precio <= 0)             { toast.error('El precio debe ser mayor a 0');        return; }
    if (formData.categorias.length === 0) { toast.error('Selecciona al menos una categoría');   return; }
    if (formData.imagenes.length === 0)   { toast.error('Sube al menos una imagen');            return; }
    if (
      (tipoTalla === "ropa" || tipoTalla === "calzado") &&
      formData.tallas.length === 0
    ) {
      toast.error('Selecciona al menos una talla disponible');
      return;
    }

    setLoading(true);
    try {
      if (isEditing && product) {
        await updateProduct(product.id, formData);
        toast.success('Producto actualizado correctamente');
      } else {
        await createProduct(formData);
        toast.success('Producto creado correctamente');
      }
      router.push('/studio/products');
      router.refresh();
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error(error.message || 'Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  // ────────────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} onKeyPress={handleKeyPress} className="px-6 pb-6 pt-2 space-y-6 bg-eshop-bgMain">

      {/* ── Información básica ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <Label className="pb-3 text-base text-eshop-textPrimary font-semibold" htmlFor="nombre">
            Nombre del Producto <span className="text-eshop-textError">*</span>
          </Label>
          <Input
            className="bg-eshop-formsBackground border-eshop-textSecondary text-eshop-textPrimary placeholder:text-eshop-textSecondary/60 tracking-wide focus:border-eshop-goldLight"
            id="nombre" name="nombre"
            value={formData.nombre} onChange={handleChange}
            placeholder="Ej: iPhone 15 Pro 128gb" required
          />
        </div>

        <div>
          <Label className="pb-3 text-base text-eshop-textPrimary font-semibold" htmlFor="slug">
            Slug (URL) <span className="text-eshop-textError">*</span>
          </Label>
          <Input
            className="bg-eshop-formsBackground border-eshop-textSecondary text-eshop-textPrimary placeholder:text-eshop-textSecondary/60 tracking-wide focus:border-eshop-goldLight"
            id="slug" name="slug"
            value={formData.slug} onChange={handleChange}
            placeholder="iphone-15-pro-128gb" required
          />
        </div>

        <div>
          <Label className="pb-3 text-base text-eshop-textPrimary font-semibold" htmlFor="precio">
            Precio (COP) <span className="text-eshop-textError">*</span>
          </Label>
          <Input
            className="bg-eshop-formsBackground border-eshop-textSecondary text-eshop-textPrimary placeholder:text-eshop-textSecondary/60 tracking-wide focus:border-eshop-goldLight"
            id="precio" name="precio" type="number"
            value={formData.precio} onChange={handleChange}
            placeholder="2300000" min="0" required
          />
        </div>

        <div>
          <Label className="pb-3 text-base text-eshop-textPrimary font-semibold" htmlFor="stock">
            Stock <span className="text-eshop-textError">*</span>
          </Label>
          <Input
            className="bg-eshop-formsBackground border-eshop-textSecondary text-eshop-textPrimary placeholder:text-eshop-textSecondary/60 tracking-wide focus:border-eshop-goldLight"
            id="stock" name="stock" type="number"
            value={formData.stock} onChange={handleChange}
            placeholder="20" min="0" required
          />
        </div>
      </div>

      {/* ── Descripción ────────────────────────────────────────────────── */}
      <div>
        <Label className="pb-3 text-base text-eshop-textPrimary font-semibold" htmlFor="descripcion">
          Descripción <span className="text-eshop-textError">*</span>
        </Label>
        <Textarea
          id="descripcion" name="descripcion"
          value={formData.descripcion} onChange={handleChange}
          placeholder="Describe el producto..." rows={4} required
          className="bg-eshop-formsBackground border-eshop-textSecondary text-eshop-textPrimary placeholder:text-eshop-textSecondary/60 focus:border-eshop-goldLight"
        />
      </div>

      {/* ── Categorías ─────────────────────────────────────────────────── */}
      <div>
        <Label className="pb-3 text-base text-eshop-textPrimary font-semibold">
          Categorías <span className="text-eshop-textError">*</span>
        </Label>
        <p className="text-sm text-eshop-textSecondary mb-3">
          Selecciona una o más categorías. La primera será la principal.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map(category => (
            <label
              key={category.id}
              className={`text-eshop-textPrimary flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                formData.categorias.includes(category.slug)
                  ? 'border-eshop-accent bg-eshop-bgWhite shadow-sm'
                  : 'border-eshop-textSecondary bg-eshop-bgCard hover:border-eshop-goldLight hover:scale-105'
              }`}
            >
              <input
                className="w-4 h-4 accent-eshop-accent"
                type="checkbox"
                checked={formData.categorias.includes(category.slug)}
                onChange={() => handleCategoryChange(category.slug)}
              />
              <span className="text-sm font-medium">{category.titulo}</span>
            </label>
          ))}
        </div>
        {categories.length === 0 && (
          <p className="text-sm text-eshop-textError mt-2">
            ⚠️ No hay categorías disponibles.{' '}
            <a href="/studio/categories" className="text-eshop-accent hover:underline">
              Crear categoría primero
            </a>
          </p>
        )}
      </div>

      {/* ── Variante ───────────────────────────────────────────────────── */}
      <div>
        <Label className="pb-3 text-base text-eshop-textPrimary font-semibold" htmlFor="variante">
          Variante (Opcional)
        </Label>
        <Input
          className="bg-eshop-formsBackground border-eshop-textSecondary text-eshop-textPrimary placeholder:text-eshop-textSecondary/60 focus-visible:ring-eshop-accent/30 tracking-wide"
          id="variante" name="variante"
          value={formData.variante} onChange={handleChange}
          placeholder="Ej: Tecnología, Gama Alta, Oferta, etc."
        />
      </div>

      {/* ── Tallas ─────────────────────────────────────────────────────── */}
      <div>
        <Label className="pb-3 text-base text-eshop-textPrimary font-semibold">
          Tallas disponibles
        </Label>
        <p className="text-sm text-eshop-textSecondary mb-3">
          Elige el tipo de talla según el producto
        </p>

        {/* Selector de tipo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {(Object.keys(TIPO_TALLA_CONFIG) as TipoTalla[]).map((tipo) => {
            const { label, icon, descripcion } = TIPO_TALLA_CONFIG[tipo];
            const activo = tipoTalla === tipo;
            return (
              <button
                key={tipo}
                type="button"
                onClick={() => handleTipoTallaChange(tipo)}
                className={`flex flex-col items-center justify-center gap-1.5 p-3 border-2 rounded-xl font-medium transition-all ${
                  activo
                    ? 'border-eshop-accent bg-eshop-accent text-eshop-textDark shadow-md scale-[1.02]'
                    : 'border-eshop-textSecondary bg-eshop-bgWhite text-eshop-textPrimary hover:border-eshop-accent/50'
                }`}
              >
                <span className="text-2xl">{icon}</span>
                <span className="text-sm font-bold">{label}</span>
                <span className="text-xs text-center opacity-70 leading-tight">{descripcion}</span>
              </button>
            );
          })}
        </div>

        {/* Contenedor dinámico de tallas */}
        {(tipoTalla === "ropa" || tipoTalla === "calzado") && (
          <div className="bg-eshop-bgCard border border-eshop-textSecondary rounded-xl p-4">
            <p className="text-sm font-semibold text-eshop-textPrimary mb-3">
              Selecciona las opciones: <span className="text-eshop-textError">*</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {(tipoTalla === "ropa" ? TALLAS_ROPA : TALLAS_CALZADO).map((talla) => {
                const seleccionada = formData.tallas.includes(talla);
                return (
                  <button
                    key={talla}
                    type="button"
                    onClick={() => handleTallaToggle(talla)}
                    className={`px-4 py-2 rounded-lg border-2 font-bold text-sm transition-all ${
                      seleccionada
                        ? 'border-eshop-goldDeep bg-eshop-accent text-eshop-textDark shadow-sm scale-105'
                        : 'border-eshop-textSecondary bg-eshop-bgWhite text-eshop-textSecondary hover:border-eshop-accent'
                    }`}
                  >
                    {talla}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Talla única / Sin tallas Mensajes */}
        {tipoTalla === "unica" && (
          <div className="flex items-center gap-3 bg-eshop-inCart border border-eshop-goldLight rounded-xl px-4 py-3">
            <span className="text-2xl">✅</span>
            <p className="text-sm font-semibold text-eshop-textPrimary">Talla única seleccionada</p>
          </div>
        )}

        {tipoTalla === "ninguna" && (
          <div className="flex items-center gap-3 bg-eshop-bgCard border border-eshop-textSecondary rounded-xl px-4 py-3">
            <span className="text-2xl">📵</span>
            <p className="text-sm font-semibold text-eshop-textPrimary">Sin tallas (Productos generales)</p>
          </div>
        )}
      </div>

      {/* ── Imágenes ───────────────────────────────────────────────────── */}
      <div>
        <Label className="pb-3 text-base text-eshop-textPrimary font-semibold">
          Imágenes del Producto <span className="text-eshop-textError">*</span>
        </Label>
        <div className="border-2 border-dashed border-eshop-goldLight rounded-lg p-6 bg-eshop-bgCard/50">
          <input
            type="file" accept="image/*" multiple
            onChange={handleImageUpload}
            disabled={uploading || formData.imagenes.length >= 5}
            id="image-upload"
            className="hidden"
          />
          <label
            htmlFor="image-upload"
            className={`flex flex-col items-center justify-center cursor-pointer ${
              uploading || formData.imagenes.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? (
              <Loader2 className="w-12 h-12 text-eshop-accent animate-spin mb-3" />
            ) : (
              <Upload className="w-12 h-12 text-eshop-textSecondary mb-3" />
            )}
            <p className="text-sm font-medium text-eshop-textPrimary">
              {uploading ? 'Subiendo...' : 'Click para subir imágenes (Máx 5)'}
            </p>
          </label>
        </div>

        {/* Preview de Imágenes */}
        {formData.imagenes.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {formData.imagenes.map((url, index) => (
              <div key={index} className="relative group border-2 border-eshop-textSecondary rounded-lg overflow-hidden">
                <div className="relative w-full h-32 bg-eshop-bgCard">
                  <Image src={safeImage(url)} alt="Preview" fill className="object-cover" unoptimized />
                </div>
                <button
                  type="button" onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 bg-eshop-cancelCart text-white rounded-full hover:bg-eshop-cancelCartHover transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Botones ────────────────────────────────────────────────────── */}
      <div className="flex gap-4 pt-6 border-t border-eshop-textSecondary items-center justify-center">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="border-2 font-semibold transition-all hover:scale-105 border-eshop-cancelCart text-eshop-cancelCart hover:bg-eshop-cancelCart hover:text-white rounded-lg px-4 py-2 w-full md:w-1/4"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading || uploading}
          className="font-semibold transition-all hover:scale-105 bg-eshop-buttonBase text-eshop-textDark hover:bg-eshop-buttonHover rounded-lg px-4 py-2 w-full md:w-1/4 flex items-center justify-center gap-2 shadow-md"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {isEditing ? 'Guardar Cambios' : 'Crear Producto'}
        </button>
      </div>
    </form>
  );
}