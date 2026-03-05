"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { createProduct, updateProduct } from '@/lib/firebase/admin';
import type { Category } from '@/lib/firebase/categories'; // ← Cambio aquí
import type { Productos } from '@/lib/firebase/products';
import toast from 'react-hot-toast';
import { Loader2, Upload, X } from 'lucide-react';
import Image from 'next/image';

interface Props {
  categories: Category[];
  product?: Productos & { id: string };
  isEditing?: boolean;
}

export default function ProductForm({ categories, product, isEditing = false }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: product?.nombre || '',
    slug: product?.slug || '',
    precio: product?.precio || 0,
    descripcion: product?.descripcion || '',
    variante: product?.variante || '', // ← Ahora es texto libre
    categorias: product?.categorias || [], // ← Array de categorías (múltiples)
    stock: product?.stock || 0,
    imagenes: product?.imagenes || [],
  });

  // Generar slug automáticamente
  useEffect(() => {
    if (!isEditing && formData.nombre) {
      const slug = formData.nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  setUploading(true);
  const uploadedUrls: string[] = [];

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validar tamaño del archivo (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} es demasiado grande (máx. 5MB)`);
        continue;
      }

      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} no es una imagen válida`);
        continue;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'gaboshop');

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/duwosb0hu/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Validar que la respuesta tenga secure_url
        if (data.secure_url && typeof data.secure_url === 'string') {
          uploadedUrls.push(data.secure_url);
        } else {
          console.error('Invalid Cloudinary response:', data);
          toast.error(`Error al subir ${file.name}`);
        }
      } catch (uploadError) {
        console.error('Error uploading file:', file.name, uploadError);
        toast.error(`No se pudo subir ${file.name}`);
      }
    }

    if (uploadedUrls.length > 0) {
      setFormData(prev => ({
        ...prev,
        imagenes: [...prev.imagenes, ...uploadedUrls],
      }));

      toast.success(`${uploadedUrls.length} imagen(es) subida(s)`);
    }
  } catch (error) {
    console.error('Error uploading images:', error);
    toast.error('Error al subir imágenes');
  } finally {
    setUploading(false);
    // Limpiar el input para permitir subir el mismo archivo de nuevo si falla
    e.target.value = '';
  }
};

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombre.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }
    if (!formData.slug.trim()) {
      toast.error('El slug es obligatorio');
      return;
    }
    if (formData.precio <= 0) {
      toast.error('El precio debe ser mayor a 0');
      return;
    }
    if (formData.categorias.length === 0) {
      toast.error('Selecciona al menos una categoría');
      return;
    }
    if (formData.imagenes.length === 0) {
      toast.error('Sube al menos una imagen');
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

  return (
    <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 space-y-6">
      {/* Información básica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Nombre */}
        <div>
          <Label className='pb-3 text-base text-danashop-textPrimary' htmlFor="nombre">
            Nombre del Producto <span className="text-red-500">*</span>
          </Label>
          <Input
            className='text-danashop-textPrimary placeholder:text-danashop-text-Secondary tracking-wide'
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: iPhone 15 Pro 128gb"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <Label className='pb-3 text-base text-danashop-textPrimary' htmlFor="slug">
            Slug (URL) <span className="text-red-500">*</span>
          </Label>
          <Input
            className='text-danashop-textPrimary placeholder:text-danashop-text-Secondary tracking-wide'
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="iphone-15-pro-128gb"
            required
          />
        </div>

        {/* Precio */}
        <div>
          <Label className='pb-3 text-base text-danashop-textPrimary' htmlFor="precio">
            Precio (COP) <span className="text-red-500">*</span>
          </Label>
          <Input
            className='text-danashop-textPrimary placeholder:text-danashop-text-Secondary tracking-wide'
            id="precio"
            name="precio"
            type="number"
            value={formData.precio}
            onChange={handleChange}
            placeholder="2300000"
            min="0"
            required
          />
        </div>

        {/* Stock */}
        <div>
          <Label className='pb-3 text-base text-danashop-textPrimary' htmlFor="stock">
            Stock <span className="text-red-500">*</span>
          </Label>
          <Input
            className='text-danashop-textPrimary placeholder:text-danashop-text-Secondary tracking-wide'
            id="stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            placeholder="20"
            min="0"
            required
          />
        </div>
      </div>

      {/* Descripción */}
      <div>
        <Label className='pb-3 text-base text-danashop-textPrimary' htmlFor="descripcion">
          Descripción <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Describe el producto..."
          rows={4}
          required
          className='text-danashop-textPrimary placeholder:text-danashop-textSecondary'
        />
      </div>

      {/* Categorías (Múltiples) */}
      <div>
        <Label className='pb-3 text-base text-danashop-textPrimary'>
          Categorías <span className="text-red-500">*</span>
        </Label>
        <p className="text-sm text-danashop-textSecondary mb-3">
          Selecciona una o más categorías. La primera será la principal.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map(category => (
            <label
              key={category.id}
              className={`text-danashop-textPrimary flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                formData.categorias.includes(category.slug)
                  ? 'border-danashop-brandHover bg-danashop-bgColorCard'
                  : 'border-danashop-secontext-danashop-textSecondary hover:border-danashop-secontext-danashop-textSecondary hover:scale-105 hoverEffect'
              }`}
            >
              <input
                className='text-danashop-textPrimary tracking-wide w-4 h-4'
                type="checkbox"
                checked={formData.categorias.includes(category.slug)}
                onChange={() => handleCategoryChange(category.slug)}
              />
              <span className="text-sm font-medium">{category.titulo}</span>
            </label>
          ))}
        </div>
        {categories.length === 0 && (
          <p className="text-sm text-red-500 mt-2">
            ⚠️ No hay categorías disponibles.{' '}
            <a href="/studio/categories" className="text-danashop-textPrimary hover:underline">
              Crear categoría primero
            </a>
          </p>
        )}
        {formData.categorias.length > 0 && (
          <p className="text-xs text-danashop-textSecondary mt-2">
            Categoría principal: <span className="font-bold">{formData.categorias[0]}</span>
            {formData.categorias.length > 1 && (
              <>, Secundarias: <span className="font-bold">{formData.categorias.slice(1).join(', ')}</span></>
            )}
          </p>
        )}
      </div>

      {/* Variante (Texto libre) */}
      <div>
        <Label className='pb-3 text-base text-danashop-textPrimary' htmlFor="variante">
          Variante (Opcional)
        </Label>
        <Input
          className='placeholder:text-danashop-textPrimary focus-visible:ring-danashop-brandHover/70 focus-visible:border-ring focus-visible:ring-[3px] text-danashop-textPrimary tracking-wide'
          id="variante"
          name="variante"
          value={formData.variante}
          onChange={handleChange}
          placeholder="Ej: Tecnologia, Gama Alta, Oferta, etc."
        />
        <p className="text-xs text-danashop-textSecondary mt-1">
          Usa esto para clasificaciones adicionales o etiquetas especiales
        </p>
      </div>

      {/* Imágenes */}
      <div>
        <Label className='pb-3 text-base text-danashop-textPrimary'>
          Imágenes del Producto <span className="text-red-500">*</span>
        </Label>
        <p className="text-sm text-danashop-textSecondary mb-3">
          Sube al menos una imagen (máximo 5)
        </p>

        {/* Zona de subida */}
        <div className="border-2 border-dashed border-danashop-secontext-danashop-textSecondary rounded-lg p-6">
          <input
            className='text-danashop-textPrimary placeholder:text-danashop-text-Secondary tracking-wide hidden'
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={uploading || formData.imagenes.length >= 5}
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={`flex flex-col items-center justify-center cursor-pointer ${
              uploading || formData.imagenes.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? (
              <Loader2 className="w-12 h-12 text-danashop-textSecondary animate-spin mb-3" />
            ) : (
              <Upload className="w-12 h-12 text-danashop-textSecondary mb-3" />
            )}
            <p className="text-sm text-danashop-textSecondary">
              {uploading
                ? 'Subiendo imágenes...'
                : formData.imagenes.length >= 5
                ? 'Máximo 5 imágenes alcanzado'
                : 'Click para subir imágenes'}
            </p>
            <p className="text-xs text-danashop-textSecondary mt-1">
              PNG, JPG o WEBP (máx. 5MB cada una)
            </p>
          </label>
        </div>

        {/* Previsualización de imágenes */}
        {formData.imagenes.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {formData.imagenes
            .filter(url => url && url.trim() !== '') // ← FILTRAR URLs vacías
            .map((url, index) => (
                <div key={index} className="relative group">
                <div className="relative w-full h-32 border rounded-lg overflow-hidden bg-danashop-secontext-danashop-textSecondary">
                    <Image
                    src={url}
                    alt={`Imagen ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized // ← Agregar esto para Cloudinary
                    onError={(e) => {
                        // Manejar error de carga de imagen
                        console.error('Error loading image:', url);
                        e.currentTarget.src = '/placeholder-image.png'; // Opcional: imagen de respaldo
                    }}
                    />
                </div>
                <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                    <X className="w-4 h-4" />
                </button>
                {index === 0 && (
                    <span className="absolute bottom-2 left-2 px-2 py-2 bg-green-500 text-white text-xs rounded">
                    Principal
                    </span>
                )}
                </div>
            ))}
        </div>
        )}
        </div>

      {/* Botones */}
      <div className="flex gap-4 pt-6 border-t items-center justify-center">
        <button
          className='border-2 font-semibold hoverEffect hover:scale-105 bg-red-300 hover:bg-danashop-error tracking-wide border-danashop-error rounded-lg px-4 py-2 w-full md:w-1/4 hover:text-danashop-textPrimary'
          type="button"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancelar
        </button>
        <button 
          className='border-2 font-semibold hover:scale-105 tracking-wide border-danashop-brandHover bg-danashop-brandSoft/90 hover:bg-danashop-brandHover hoverEffect text-danashop-textDark hover:text-danashop-textPrimary rounded-lg px-4 py-2 w-full md:w-1/4'
          type="submit" disabled={loading || uploading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isEditing ? 'Guardando...' : 'Creando...'}
            </>
          ) : (
            <>{isEditing ? 'Guardar Cambios' : 'Crear Producto'}</>
          )}
        </button>
      </div>
    </form>
  );
}