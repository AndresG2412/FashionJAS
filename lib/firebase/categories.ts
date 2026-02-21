import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from './config';

export interface Category {
  id: string;
  titulo: string;
  slug: string;
  descripcion?: string;
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const categoriesRef = collection(db, 'categorias');
    const q = query(categoriesRef, orderBy('titulo', 'asc'));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Category[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}