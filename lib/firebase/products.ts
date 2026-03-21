import { collection, query, where, orderBy, getDocs, and, QueryConstraint } from 'firebase/firestore';
import { db } from './config';

// 1. Tu interfaz actualizada
export interface Productos {
  id: string;
  nombre: string;
  slug: string;
  precio: number;
  imagenes: string[];
  descripcion: string;
  categorias: string[];
  stock: number;
  subido: Date;
  tallas?: string[];
  colores?: string[]; // ← nuevo campo
}

// Helper para mapear los datos de Firestore al tipo Productos
const mapDocToProduct = (doc: any): Productos => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    subido: data.subido?.toDate() || new Date(),
  } as Productos;
};

export async function getFilteredProducts(filters: {
  category?: string | null;
  minPrice?: number;
  maxPrice?: number;
}): Promise<Productos[]> {
  try {
    const productsRef = collection(db, 'productos');
    const q = query(productsRef, orderBy('nombre', 'asc'));
    const snapshot = await getDocs(q);

    const productsData = snapshot.docs.map(mapDocToProduct);

    return productsData.filter(product => {
      const matchCategory = filters.category 
        ? product.categorias?.some(cat => cat.toLowerCase() === filters.category?.toLowerCase())
        : true;

      const matchPrice = product.precio >= (filters.minPrice || 0) && 
                         product.precio <= (filters.maxPrice || 100000000);

      return matchCategory && matchPrice;
    });
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    return [];
  }
}

export async function getProductsByCategory(category: string): Promise<Productos[]> {
  try {
    const productsRef = collection(db, 'productos'); 
    
    const lower = category.toLowerCase();
    const upper = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

    const q = query(
      productsRef,
      where('categorias', 'array-contains-any', [lower, upper]), 
      orderBy('nombre', 'asc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapDocToProduct);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
}

export async function getAllProducts(): Promise<Productos[]> {
  try {
    const productsRef = collection(db, 'productos');
    const q = query(productsRef, orderBy('nombre', 'asc'));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapDocToProduct);
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Productos | null> {
  try {
    const productsRef = collection(db, 'productos');
    const q = query(productsRef, where('slug', '==', slug));
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    
    return mapDocToProduct(snapshot.docs[0]);
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}

export async function getProductsByIds(ids: string[]): Promise<Productos[]> {
  if (ids.length === 0) return [];

  const chunks: string[][] = [];
  for (let i = 0; i < ids.length; i += 10) {
    chunks.push(ids.slice(i, i + 10));
  }

  const results: Productos[] = [];
  for (const chunk of chunks) {
    const q = query(
      collection(db, 'productos'),
      where('__name__', 'in', chunk)
    );
    const snapshot = await getDocs(q);
    results.push(...snapshot.docs.map(mapDocToProduct));
  }

  return results;
}

import { searchProductsAdmin } from './admin';

export { searchProductsAdmin };