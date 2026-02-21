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
}): Promise<Productos[]> { // Cambio de tipo
  try {
    const productsRef = collection(db, 'productos'); // Cambio de 'products' a 'productos'
    
    // Cambiamos 'name' por 'nombre' en el orderBy
    const allProductsQuery = query(productsRef, orderBy('nombre', 'asc'));
    const snapshot = await getDocs(allProductsQuery);

    const productsData = snapshot.docs.map(mapDocToProduct);

    let filteredProducts = productsData;

    if (filters.category) {
      filteredProducts = filteredProducts.filter(product => 
        product.categorias && 
        product.categorias.some(cat => 
          cat.toLowerCase() === filters.category!.toLowerCase()
        )
      );
    }

    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => 
        product.precio >= filters.minPrice! // Cambio de price a precio
      );
    }
    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => 
        product.precio <= filters.maxPrice! // Cambio de price a precio
      );
    }

    return filteredProducts;
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    return [];
  }
}

// En product.ts

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