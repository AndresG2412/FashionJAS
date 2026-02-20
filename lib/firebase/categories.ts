import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from './config';

export interface Category {
  id: string;
  title: string;
  slug: string;
  description?: string;
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, orderBy('title', 'asc'));
    
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