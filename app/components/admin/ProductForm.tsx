"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { createProductAction, updateProductAction } from '@/app/actions/productActions';
import type { Category } from '@/lib/firebase/categories';
import type { Productos } from '@/lib/firebase/products';
import toast from 'react-hot-toast';
import { Loader2, Upload, X, Plus } from 'lucide-react';
import Image from 'next/image';

const safeImage = (url?: string) => {
  if (!url || typeof url !== "string") return "/placeholder.png";
  try { return encodeURI(url.replace("http://", "https://")); }
  catch { return "/placeholder.png"; }
};

interface Props {
  categories: Category[];
  product?: Productos & { id: string };
  isEditing?: boolean;
}

export default function ProductForm({ categories, product, isEditing = false }: Props) {
  const router = useRouter();
  const [loading, setLoading]     = useState(false);
  const [uploading, setUploading] = useState(false);

  const [colorInput, setColorInput] = useState('');
  const colorInputRef = useRef<HTMLInputElement>(null);

  const [tallaInput, setTallaInput] = useState('');
  const tallaInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    nombre:      product?.nombre      || '',
    slug:        product?.slug        || '',
    precio:      product?.precio      || 0,
    descripcion: product?.descripcion || '',
    categorias:  product?.categorias  || [],
    stock:       product?.stock       || 0,
    imagenes:    product?.imagenes    || [],
    tallas:      product?.tallas      || [],
    colores:     (product?.colores ?? []) as string[],
  });

  useEffect(() => {
    if (!isEditing && formData.nombre) {
      const slug = formData.nombre
        .toLowerCase().normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.nombre, isEditing]);

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

  const handleKeyPress = (e: React.KeyboardEvent) => { if (e.key === 'Enter') e.preventDefault(); };

  // ── Tallas ───────────────────────────────────────────────────────────────
  const agregarTalla = () => {
    const talla = tallaInput.trim().toUpperCase();
    if (!talla) return;

    const esLetras  = /^[A-Z]+$/.test(talla);
    const esNumeros = /^\d+$/.test(talla);

    if (!esLetras && !esNumeros) {
      toast.error('Solo letras (S, M, XL) o números (36, 42)');
      return;
    }
    if (esLetras && talla.length > 3) {
      toast.error('Tallas en letras: máximo 3 caracteres (ej: XXL)');
      return;
    }
    if (esNumeros && talla.length > 2) {
      toast.error('Tallas numéricas: máximo 2 dígitos (ej: 42)');
      return;
    }
    if (formData.tallas.includes(talla)) {
      toast.error('Esa talla ya fue agregada');
      return;
    }

    setFormData(prev => ({ ...prev, tallas: [...prev.tallas, talla] }));
    setTallaInput('');
    tallaInputRef.current?.focus();
  };

  const handleTallaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); agregarTalla(); }
  };

  const eliminarTalla = (talla: string) => {
    setFormData(prev => ({ ...prev, tallas: prev.tallas.filter(t => t !== talla) }));
  };

  // ── Colores ──────────────────────────────────────────────────────────────
  const agregarColor = () => {
    const color = colorInput.trim();
    if (!color) return;
    const colorNormalizado = color.charAt(0).toUpperCase() + color.slice(1).toLowerCase();
    if (formData.colores.includes(colorNormalizado)) { toast.error('Ese color ya fue agregado'); return; }
    setFormData(prev => ({ ...prev, colores: [...prev.colores, colorNormalizado] }));
    setColorInput('');
    colorInputRef.current?.focus();
  };

  const handleColorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); agregarColor(); }
  };

  const eliminarColor = (color: string) => {
    setFormData(prev => ({ ...prev, colores: prev.colores.filter(c => c !== color) }));
  };

  // ── Imágenes ─────────────────────────────────────────────────────────────
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploadedUrls: string[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) { toast.error(`${file.name} es demasiado grande (máx. 5MB)`); continue; }
        if (!file.type.startsWith('image/')) { toast.error(`${file.name} no es una imagen válida`); continue; }
        const fd = new FormData();
        fd.append('file', file);
        fd.append('upload_preset', 'gaboshop');
        try {
          const response = await fetch(`https://api.cloudinary.com/v1_1/duwosb0hu/image/upload`, { method: 'POST', body: fd });
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          if (data.secure_url) uploadedUrls.push(data.secure_url);
          else toast.error(`Error al subir ${file.name}`);
        } catch { toast.error(`No se pudo subir ${file.name}`); }
      }
      if (uploadedUrls.length > 0) {
        setFormData(prev => ({ ...prev, imagenes: [...prev.imagenes, ...uploadedUrls] }));
        toast.success(`${uploadedUrls.length} imagen(es) subida(s)`);
      }
    } finally { setUploading(false); e.target.value = ''; }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, imagenes: prev.imagenes.filter((_, i) => i !== index) }));
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim())          { toast.error('El nombre es obligatorio');         return; }
    if (!formData.slug.trim())            { toast.error('El slug es obligatorio');            return; }
    if (formData.precio <= 0)             { toast.error('El precio debe ser mayor a 0');      return; }
    if (formData.categorias.length === 0) { toast.error('Selecciona al menos una categoría'); return; }
    if (formData.imagenes.length === 0)   { toast.error('Sube al menos una imagen');          return; }

    setLoading(true);
    try {
      if (isEditing && product) {
        await updateProductAction(product.id, formData);
        toast.success('Producto actualizado correctamente');
      } else {
        await createProductAction(formData);
        toast.success('Producto creado correctamente');
      }
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push('/studio/products');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} onKeyPress={handleKeyPress} className="px-6 pb-6 pt-2 space-y-6 bg-eshop-bgMain">

      {/* Información básica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <Label className="pb-3 text-base text-eshop-textPrimary font-semibold" htmlFor="nombre">Nombre <span className="text-eshop-textError">*</span></Label>
          <Input className="bg-eshop-formsBackground border-eshop-textSecondary text-eshop-textPrimary placeholder:text-eshop-textSecondary/60 tracking-wide focus:border-eshop-goldLight" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: iPhone 15 Pro 128gb" required />
        </div>
        <div>
          <Label className="pb-3 text-base text-eshop-textPrimary font-semibold" htmlFor="slug">Slug (URL) <span className="text-eshop-textError">*</span></Label>
          <Input className="bg-eshop-formsBackground border-eshop-textSecondary text-eshop-textPrimary placeholder:text-eshop-textSecondary/60 tracking-wide focus:border-eshop-goldLight" id="slug" name="slug" value={formData.slug} onChange={handleChange} placeholder="iphone-15-pro-128gb" required />
        </div>
        <div>
          <Label className="pb-3 text-base text-eshop-textPrimary font-semibold" htmlFor="precio">Precio (COP) <span className="text-eshop-textError">*</span></Label>
          <Input className="bg-eshop-formsBackground border-eshop-textSecondary text-eshop-textPrimary placeholder:text-eshop-textSecondary/60 tracking-wide focus:border-eshop-goldLight" id="precio" name="precio" type="number" value={formData.precio} onChange={handleChange} placeholder="2300000" min="0" required />
        </div>
        <div>
          <Label className="pb-3 text-base text-eshop-textPrimary font-semibold" htmlFor="stock">Stock <span className="text-eshop-textError">*</span></Label>
          <Input className="bg-eshop-formsBackground border-eshop-textSecondary text-eshop-textPrimary placeholder:text-eshop-textSecondary/60 tracking-wide focus:border-eshop-goldLight" id="stock" name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="20" min="0" required />
        </div>
      </div>

      {/* Descripción */}
      <div>
        <Label className="pb-3 text-base text-eshop-textPrimary font-semibold" htmlFor="descripcion">Descripción <span className="text-eshop-textError">*</span></Label>
        <Textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Describe el producto..." rows={4} required className="bg-eshop-formsBackground border-eshop-textSecondary text-eshop-textPrimary placeholder:text-eshop-textSecondary/60 focus:border-eshop-goldLight" />
      </div>

      {/* Categorías */}
      <div>
        <Label className="pb-3 text-base text-eshop-textPrimary font-semibold">Categorías <span className="text-eshop-textError">*</span></Label>
        <p className="text-sm text-eshop-textSecondary mb-3">Selecciona una o más categorías. La primera será la principal.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map(category => (
            <label key={category.id} className={`text-eshop-textPrimary flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${formData.categorias.includes(category.slug) ? 'border-eshop-accent bg-eshop-bgWhite shadow-sm' : 'border-eshop-textSecondary bg-eshop-bgCard hover:border-eshop-goldLight hover:scale-105'}`}>
              <input className="w-4 h-4 accent-eshop-accent" type="checkbox" checked={formData.categorias.includes(category.slug)} onChange={() => handleCategoryChange(category.slug)} />
              <span className="text-sm font-medium">{category.titulo}</span>
            </label>
          ))}
        </div>
        {categories.length === 0 && (
          <p className="text-sm text-eshop-textError mt-2">⚠️ No hay categorías. <a href="/studio/categories" className="text-eshop-accent hover:underline">Crear categoría primero</a></p>
        )}
      </div>

      {/* Tallas */}
      <div>
        <Label className="pb-3 text-base text-eshop-textPrimary font-semibold">
          Tallas disponibles <span className="text-eshop-textSecondary font-normal text-sm">(Opcional)</span>
        </Label>
        <p className="text-sm text-eshop-textSecondary mb-3">
          Escribe una talla y presiona{' '}
          <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-eshop-bgCard border border-eshop-textSecondary rounded">Enter</kbd>
          {' '}o el botón <span className="font-semibold">+</span>.{' '}
          Letras máx. 3: <span className="font-bold text-eshop-goldDeep">S, M, XL, XXL</span> —{' '}
          Números máx. 2 dígitos: <span className="font-bold text-eshop-goldDeep">36, 42</span>
        </p>
        <div className="flex gap-2">
          <Input
            ref={tallaInputRef}
            className="bg-eshop-formsBackground border-eshop-textSecondary text-eshop-textPrimary placeholder:text-eshop-textSecondary/60 tracking-wide focus:border-eshop-goldLight uppercase"
            value={tallaInput}
            onChange={e => setTallaInput(e.target.value)}
            onKeyDown={handleTallaKeyDown}
            placeholder="Ej: S, M, XL, 38, 42…"
            maxLength={3}
          />
          <button
            type="button"
            onClick={agregarTalla}
            disabled={!tallaInput.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border-2 border-eshop-accent bg-eshop-accent text-eshop-textDark font-semibold text-sm transition-all hover:bg-eshop-buttonHover hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Plus className="w-4 h-4" /> Agregar
          </button>
        </div>
        {formData.tallas.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.tallas.map((talla: string) => (
              <span key={talla} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-eshop-goldLight bg-eshop-bgCard text-eshop-textPrimary text-sm font-bold">
                👕 {talla}
                <button type="button" onClick={() => eliminarTalla(talla)} className="ml-0.5 p-0.5 rounded-full hover:bg-eshop-cancelCart hover:text-white transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        {formData.tallas.length === 0 && <p className="text-xs text-eshop-textSecondary/60 mt-2 italic">Aún no hay tallas agregadas.</p>}
      </div>

      {/* Colores */}
      <div>
        <Label className="pb-3 text-base text-eshop-textPrimary font-semibold">Colores disponibles <span className="text-eshop-textSecondary font-normal text-sm">(Opcional)</span></Label>
        <p className="text-sm text-eshop-textSecondary mb-3">Escribe un color y presiona <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-eshop-bgCard border border-eshop-textSecondary rounded">Enter</kbd> o el botón <span className="font-semibold">+</span></p>
        <div className="flex gap-2">
          <Input ref={colorInputRef} className="bg-eshop-formsBackground border-eshop-textSecondary text-eshop-textPrimary placeholder:text-eshop-textSecondary/60 tracking-wide focus:border-eshop-goldLight" value={colorInput} onChange={e => setColorInput(e.target.value)} onKeyDown={handleColorKeyDown} placeholder="Ej: Rojo oscuro, Verde lima…" maxLength={40} />
          <button type="button" onClick={agregarColor} disabled={!colorInput.trim()} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border-2 border-eshop-accent bg-eshop-accent text-eshop-textDark font-semibold text-sm transition-all hover:bg-eshop-buttonHover hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100">
            <Plus className="w-4 h-4" /> Agregar
          </button>
        </div>
        {formData.colores.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.colores.map((color: string) => (
              <span key={color} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-eshop-goldLight bg-eshop-bgCard text-eshop-textPrimary text-sm font-medium">
                🎨 {color}
                <button type="button" onClick={() => eliminarColor(color)} className="ml-0.5 p-0.5 rounded-full hover:bg-eshop-cancelCart hover:text-white transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        {formData.colores.length === 0 && <p className="text-xs text-eshop-textSecondary/60 mt-2 italic">Aún no hay colores agregados.</p>}
      </div>

      {/* Imágenes */}
      <div>
        <Label className="pb-3 text-base text-eshop-textPrimary font-semibold">Imágenes del Producto <span className="text-eshop-textError">*</span></Label>
        <div className="border-2 border-dashed border-eshop-goldLight rounded-lg p-6 bg-eshop-bgCard/50">
          <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading || formData.imagenes.length >= 5} id="image-upload" className="hidden" />
          <label htmlFor="image-upload" className={`flex flex-col items-center justify-center cursor-pointer ${uploading || formData.imagenes.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {uploading ? <Loader2 className="w-12 h-12 text-eshop-accent animate-spin mb-3" /> : <Upload className="w-12 h-12 text-eshop-textSecondary mb-3" />}
            <p className="text-sm font-medium text-eshop-textPrimary">{uploading ? 'Subiendo...' : 'Click para subir imágenes (Máx 5)'}</p>
          </label>
        </div>
        {formData.imagenes.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {formData.imagenes.map((url, index) => (
              <div key={index} className="relative group border-2 border-eshop-textSecondary rounded-lg overflow-hidden">
                <div className="relative w-full h-32 bg-eshop-bgCard">
                  <Image src={safeImage(url)} alt="Preview" fill className="object-cover" unoptimized />
                </div>
                <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 p-1 bg-eshop-cancelCart text-white rounded-full hover:bg-eshop-cancelCartHover transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="flex gap-4 pt-6 border-t border-eshop-textSecondary items-center justify-center">
        <button type="button" onClick={() => router.back()} disabled={loading} className="border-2 font-semibold transition-all hover:scale-105 border-eshop-cancelCart text-eshop-cancelCart hover:bg-eshop-cancelCart hover:text-white rounded-lg px-4 py-2 w-full md:w-1/4">
          Cancelar
        </button>
        <button type="submit" disabled={loading || uploading} className="font-semibold transition-all hover:scale-105 bg-eshop-buttonBase text-eshop-textDark hover:bg-eshop-buttonHover rounded-lg px-4 py-2 w-full md:w-1/4 flex items-center justify-center gap-2 shadow-md">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {isEditing ? 'Guardar Cambios' : 'Crear Producto'}
        </button>
      </div>
    </form>
  );
}