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
  variante: string;
  categorias: string[];
  stock: number;
  subido: Date; // Antes era createdAt
}

// Helper para mapear los datos de Firestore al tipo Productos
const mapDocToProduct = (doc: any): Productos => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    // Aseguramos que la fecha se convierta correctamente
    subido: data.subido?.toDate() || new Date(),
  } as Productos;
};

export async function getFilteredProducts(filters: {
  category?: string | null;
  minPrice?: number;
  maxPrice?: number;
}): Promise<Productos[]> {
  try {
    const productsRef = collection(db, 'productos'); // Nombre en minúscula
    const q = query(productsRef, orderBy('nombre', 'asc'));
    const snapshot = await getDocs(q);

    const productsData = snapshot.docs.map(mapDocToProduct);

    return productsData.filter(product => {
      // 1. Filtro de Categoría (compara slug con el array de la DB)
      const matchCategory = filters.category 
        ? product.categorias?.some(cat => cat.toLowerCase() === filters.category?.toLowerCase())
        : true;

      // 2. Filtro de Precio (usando el campo 'precio' de tu DB)
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
    // 1. IMPORTANTE: Cambiar a 'productos' (minúscula) como en tu captura de pantalla
    const productsRef = collection(db, 'productos'); 
    
    const q = query(
      productsRef,
      // 2. Usamos 'array-contains' porque "categorias" es un array en tu DB
      // 3. No usamos .toLowerCase() porque en tu DB los valores empiezan con Mayúscula (e.g., "Celulares")
      where('categorias', 'array-contains', category), 
      orderBy('nombre', 'asc')
    );

    const snapshot = await getDocs(q);
    
    // Usamos el helper mapDocToProduct que ya definiste
    return snapshot.docs.map(mapDocToProduct);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
}

export async function getAllProducts(): Promise<Productos[]> {
  try {
    const productsRef = collection(db, 'productos'); // Cambio a 'Productos'
    const q = query(productsRef, orderBy('nombre', 'asc')); // Cambio a 'nombre'
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapDocToProduct);
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Productos | null> {
  try {
    const productsRef = collection(db, 'productos'); // Cambio a 'productos'
    const q = query(productsRef, where('slug', '==', slug));
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    
    return mapDocToProduct(snapshot.docs[0]);
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}

// -----------------------------------------------------------------------------
// Helpers for user favorites and similar features that need to fetch by IDs
// -----------------------------------------------------------------------------

export async function getProductsByIds(ids: string[]): Promise<Productos[]> {
  if (ids.length === 0) return [];

  // Firestore "in" queries are limited to 10 values per clause. Split if necessary.
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
