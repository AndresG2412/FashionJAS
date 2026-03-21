"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { createCategoryAction, updateCategoryAction } from '@/app/actions/categoryActions';
import type { Category } from '@/lib/firebase/categories';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

interface Props {
  category?: Category;
  isEditing?: boolean;
}

export default function CategoryForm({ category, isEditing = false }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    titulo: category?.titulo || '',
    slug: category?.slug || '',
    descripcion: category?.descripcion || '',
  });

  // Generar slug automáticamente desde el título
  useEffect(() => {
    if (!isEditing && formData.titulo) {
      const slug = formData.titulo
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.titulo, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titulo.trim()) { toast.error('El título es obligatorio'); return; }
    if (!formData.slug.trim())   { toast.error('El slug es obligatorio');    return; }

    setLoading(true);

    try {
      if (isEditing && category) {
        await updateCategoryAction(category.id, {
          slug: formData.slug,
          descripcion: formData.descripcion,
        });
        toast.success('Categoría actualizada correctamente');
      } else {
        await createCategoryAction({
          titulo: formData.titulo,
          slug: formData.slug,
          descripcion: formData.descripcion,
        });
        toast.success('Categoría creada correctamente');
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      router.push('/studio/categories');
      router.refresh();
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast.error(error.message || 'Error al guardar la categoría');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg mx-auto p-6 space-y-6 max-w-2xl">
      {/* Título */}
      <div>
        <Label htmlFor="titulo" className='pb-2 text-eshop-textPrimary'>
          Título <span className="text-eshop-textError">*</span>
        </Label>
        <Input
          id="titulo" name="titulo"
          value={formData.titulo} onChange={handleChange}
          placeholder="Ej: Celulares" required
          disabled={isEditing}
          className='text-eshop-textPrimary border-eshop-textSecondary focus:border-eshop-goldDeep bg-transparent'
        />
        {isEditing && (
          <p className="text-xs text-eshop-textSecondary mt-1 font-serif italic">
            El título no se puede modificar una vez creada la categoría
          </p>
        )}
        {!isEditing && (
          <p className="text-xs text-eshop-textSecondary mt-1 font-serif italic">
            Se guardará con la primera letra en mayúscula
          </p>
        )}
      </div>

      {/* Slug */}
      <div>
        <Label htmlFor="slug" className='pb-2 text-eshop-textPrimary'>
          Slug (URL) <span className="text-eshop-textError">*</span>
        </Label>
        <Input
          className='text-eshop-textPrimary border-eshop-textSecondary bg-eshop-formsBackground/20 cursor-not-allowed'
          id="slug" name="slug"
          value={formData.slug} onChange={handleChange}
          placeholder="Se generará automáticamente..."
          readOnly required
        />
        <p className="text-[10px] text-eshop-textSecondary uppercase tracking-tight mt-2">
          Solo lectura: Basado en el título ingresado
        </p>
      </div>

      {/* Descripción */}
      <div>
        <Label htmlFor="descripcion" className='pb-2 text-eshop-textPrimary'>
          Descripción (Opcional)
        </Label>
        <Textarea
          id="descripcion" name="descripcion"
          value={formData.descripcion} onChange={handleChange}
          placeholder="Añade una descripción para los clientes"
          rows={3}
          className='placeholder:text-eshop-textSecondary text-eshop-textPrimary border-eshop-textSecondary focus:border-eshop-goldDeep bg-transparent'
        />
      </div>

      {/* Botones */}
      <div className="flex gap-4 py-3 border-t border-eshop-textSecondary items-center justify-center">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className='font-bold hoverEffect hover:scale-105 bg-eshop-cancelCart/80 hover:bg-eshop-cancelCartHover text-eshop-textDark tracking-wide rounded-xl px-4 py-3 w-full md:w-2/4'
        >
          CANCELAR
        </button>
        <button
          type="submit"
          disabled={loading}
          className='font-bold hover:scale-105 tracking-wide bg-eshop-buttonBase hover:bg-eshop-buttonHover hoverEffect text-eshop-textDark rounded-xl px-4 py-3 w-full md:w-2/4 flex items-center justify-center'
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isEditing ? 'GUARDANDO...' : 'CREANDO...'}
            </>
          ) : (
            <>{isEditing ? 'GUARDAR CAMBIOS' : 'CREAR CATEGORÍA'}</>
          )}
        </button>
      </div>
    </form>
  );
}