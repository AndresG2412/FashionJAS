"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { createCategory, updateCategory } from '@/lib/firebase/admin';
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
        .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
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

    // Validaciones
    if (!formData.titulo.trim()) {
      toast.error('El título es obligatorio');
      return;
    }
    if (!formData.slug.trim()) {
      toast.error('El slug es obligatorio');
      return;
    }

    setLoading(true);

    try {
      if (isEditing && category) {
        // Al editar, solo actualizamos slug y descripción
        await updateCategory(category.id, {
          id: category.id,
          titulo: category.titulo, // No se cambia
          slug: formData.slug,
          descripcion: formData.descripcion,
        });
        toast.success('Categoría actualizada correctamente');
      } else {
        // Al crear, el título se capitaliza automáticamente
        await createCategory({
          titulo: formData.titulo,
          slug: formData.slug,
          descripcion: formData.descripcion,
        });
        toast.success('Categoría creada correctamente');
      }
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
        <Label htmlFor="titulo" className='pb-2 text-danashop-textPrimary'>
          Título <span className="text-red-500">*</span>
        </Label>
        <Input
          id="titulo"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          placeholder="Ej: Celulares"
          required
          disabled={isEditing} // No se puede cambiar al editar
          className='text-danashop-textPrimary'
        />
        {isEditing && (
          <p className="text-xs text-danashop-textSecondary mt-1">
            El título no se puede modificar una vez creada la categoría
          </p>
        )}
        {!isEditing && (
          <p className="text-xs text-danashop-textSecondary mt-1">
            Se guardará con la primera letra en mayúscula
          </p>
        )}
      </div>

      {/* Slug */}
      <div>
        <Label htmlFor="slug" className='pb-2 text-danashop-textPrimary'>
          Slug (URL) <span className="text-red-500">*</span>
        </Label>
        <Input
          className='text-danashop-textPrimary'
          id="slug"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          placeholder="celulares"
          required
        />
        <p className="text-xs text-danashop-textSecondary mt-1">
          Usado en las URLs y filtros (solo letras minúsculas y guiones)
        </p>
      </div>

      {/* Descripción */}
      <div>
        <Label htmlFor="descripcion" className='pb-2 text-danashop-textPrimary'>
          Descripción (Opcional)
        </Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="celulares de cualquier gama y precio"
          rows={3}
          className='placeholder:text-danashop-textSecondary text-danashop-textPrimary'
        />
      </div>

      {/* Botones */}
      <div className="flex gap-4 py-3 border-t items-center justify-center">
        <button
          type="button" 
          onClick={() => router.back()}
          disabled={loading}
          className='border-2 font-semibold hoverEffect hover:scale-110 bg-red-300 hover:bg-danashop-error tracking-wide border-danashop-error rounded-lg px-4 py-2 w-full md:w-2/4 hover:text-danashop-textPrimary'
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className='border-2 font-semibold hover:scale-110 tracking-wide border-danashop-brandHover bg-danashop-brandSoft/90 hover:bg-danashop-brandHover hoverEffect text-danashop-textDark hover:text-danashop-textPrimary rounded-lg px-4 py-2 w-full md:w-2/4'>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isEditing ? 'Guardando...' : 'Creando...'}
            </>
          ) : (
            <>{isEditing ? 'Guardar Cambios' : 'Crear Categoría'}</>
          )}
        </button>
      </div>
    </form>
  );
}