import { 
  collection, 
  addDoc,
  setDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query,
  orderBy,
  serverTimestamp,
  where,
  limit,
} from 'firebase/firestore';
import { db } from './config';
import type { Productos } from './products';
import type { Category } from './categories'; // ← Importar desde categories.ts

// ==================== CATEGORÍAS ====================

export async function getAllCategoriesAdmin(): Promise<Category[]> {
  try {
    const categoriesRef = collection(db, 'categorias');
    const q = query(categoriesRef, orderBy('titulo', 'asc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      titulo: doc.data().titulo,
      slug: doc.data().slug,
      descripcion: doc.data().descripcion || '',
    })) as Category[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Crear categoría con ID personalizado (igual al título capitalizado)
export async function createCategory(categoryData: Omit<Category, 'id'>): Promise<string> {
  try {
    // Capitalizar primera letra del título para usar como ID
    const capitalizedTitle = categoryData.titulo.charAt(0).toUpperCase() + categoryData.titulo.slice(1).toLowerCase();
    
    const categoryRef = doc(db, 'categorias', capitalizedTitle);
    
    // Verificar si ya existe
    const existingDoc = await getDoc(categoryRef);
    if (existingDoc.exists()) {
      throw new Error(`La categoría "${capitalizedTitle}" ya existe`);
    }
    
    await setDoc(categoryRef, {
      id: capitalizedTitle,
      titulo: capitalizedTitle,
      slug: categoryData.slug,
      descripcion: categoryData.descripcion || '',
    });
    
    return capitalizedTitle;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

export async function updateCategory(categoryId: string, categoryData: Partial<Category>): Promise<void> {
  try {
    const categoryRef = doc(db, 'categorias', categoryId);
    
    const updateData: any = {};
    if (categoryData.slug) updateData.slug = categoryData.slug;
    if (categoryData.descripcion !== undefined) updateData.descripcion = categoryData.descripcion;
    // No actualizamos titulo ni id para mantener consistencia
    
    await updateDoc(categoryRef, updateData);
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}

export async function deleteCategory(categoryId: string): Promise<void> {
  try {
    const categoryRef = doc(db, 'categorias', categoryId);
    await deleteDoc(categoryRef);
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}

// ==================== PRODUCTOS ====================

// 🔎 Buscar productos (nombre o categoría)
export async function searchProductsAdmin(
  mode: "nombre" | "categoria",
  text: string
): Promise<Productos[]> {
  try {
    const productsRef = collection(db, "productos");
    let q;

    if (mode === "nombre") {
      const search = text.toLowerCase();

      q = query(
        productsRef,
        where("nombreLower", ">=", search),
        where("nombreLower", "<=", search + "\uf8ff"),
        orderBy("nombreLower"),
        limit(20)
      );
    } else {
      q = query(
        productsRef,
        where("categorias", "array-contains", text),
        limit(20)
      );
    }

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      subido: doc.data().subido?.toDate() || new Date(),
    })) as Productos[];
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}

// ⚠️ Poco stock
export async function lowStockProductsAdmin(): Promise<Productos[]> {
  try {
    const productsRef = collection(db, "productos");

    const q = query(
      productsRef,
      where("stock", "<=", 5),
      orderBy("stock", "asc"),
      limit(20)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      subido: doc.data().subido?.toDate() || new Date(),
    })) as Productos[];
  } catch (error) {
    console.error("Error fetching low stock:", error);
    return [];
  }
}

export async function getAllProductsAdmin(): Promise<Productos[]> {
  try {
    const productsRef = collection(db, 'productos');
    const q = query(productsRef, orderBy('nombre', 'asc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      subido: doc.data().subido?.toDate() || new Date(),
    })) as Productos[];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// ➕ Crear producto
export async function createProduct(
  productData: Omit<Productos, "id" | "subido">
): Promise<string> {
  try {
    const docId = productData.nombre;
    const productRef = doc(db, "productos", docId);

    await setDoc(productRef, {
      ...productData,
      nombreLower: productData.nombre.toLowerCase(),
      subido: serverTimestamp(),
    });

    return docId;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}


// ✏️ Actualizar producto
export async function updateProduct(
  productId: string,
  productData: Partial<Productos>
): Promise<void> {
  try {
    const productRef = doc(db, "productos", productId);

    const updatedData: any = { ...productData };

    if (productData.nombre) {
      updatedData.nombreLower = productData.nombre.toLowerCase();
    }

    await updateDoc(productRef, updatedData);
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}


// 🗑 Eliminar producto
export async function deleteProduct(productId: string): Promise<void> {
  try {
    const productRef = doc(db, "productos", productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

// ==================== ESTADÍSTICAS ====================

export async function getAdminStats() {
  try {
    const [products, orders, categories] = await Promise.all([
      getDocs(collection(db, 'productos')),
      getDocs(collection(db, 'orders')),
      getDocs(collection(db, 'categorias')),
    ]);

    let totalSales = 0;
    let pendingOrders = 0;

    orders.docs.forEach(doc => {
      const data = doc.data();
      if (data.payment?.status === 'APPROVED') {
        totalSales += data.total || 0;
      }
      if (data.status === 'pendiente') {
        pendingOrders++;
      }
    });

    return {
      totalProducts: products.size,
      totalOrders: orders.size,
      totalSales,
      totalCategories: categories.size,
      pendingOrders,
    };
  } catch (error) {
    console.error("Error getting stats:", error);
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalSales: 0,
      totalCategories: 0,
      pendingOrders: 0,
    };
  }
}