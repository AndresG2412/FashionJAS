import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from './config';

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  description: string;
  variant: string;
  categories: string[];
  stock: number;
  createdAt: Date;
}

// Obtener productos por variant (gadget, appliances, refrigerators, etc)
export async function getProductsByVariant(variant: string): Promise<Product[]> {
  try {
    const productsRef = collection(db, 'products');
    const q = query(
      productsRef,
      where('variant', '==', variant.toLowerCase()),
      orderBy('name', 'asc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Product[];
  } catch (error) {
    console.error("Error fetching products by variant:", error);
    return [];
  }
}

// Obtener todos los productos
export async function getAllProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('name', 'asc'));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Product[];
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
}

// Obtener un producto por slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('slug', '==', slug));
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    } as Product;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}