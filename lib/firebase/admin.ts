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

// ==================== ÓRDENES ====================

export interface Order {
  id?: string;
  reference: string;
  transactionId: string;
  userId: string;
  status: "pendiente" | "en-envio" | "entregado" | "cancelado";
  customer: {
    name: string;
    email: string;
    phone: string;
    legalId?: string;
    legalIdType?: string;
  };
  shipping: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  payment: {
    transactionId: string;
    method: string;
    status: string;
    amount: number;
    currency: string;
    paymentDate: string;
  };
  total: number;
  subtotal: number;
  shippingCost: number;
  notes?: string;
  adminNotes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 📋 Obtener todas las órdenes (ordenadas por fecha de creación)
export async function getAllOrdersAdmin(): Promise<Order[]> {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc')); // Más reciente primero
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Order[];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

// 🔍 Buscar órdenes por referencia o email
export async function searchOrdersAdmin(searchText: string): Promise<Order[]> {
  try {
    const ordersRef = collection(db, 'orders');
    const snapshot = await getDocs(ordersRef);
    
    const searchLower = searchText.toLowerCase();
    
    return snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      }))
      .filter((order: any) => {
        return (
          order.reference?.toLowerCase().includes(searchLower) ||
          order.customer?.email?.toLowerCase().includes(searchLower) ||
          order.customer?.name?.toLowerCase().includes(searchLower)
        );
      }) as Order[];
  } catch (error) {
    console.error("Error searching orders:", error);
    return [];
  }
}

// 🔎 Filtrar órdenes por estado
export async function getOrdersByStatus(status: Order['status']): Promise<Order[]> {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Order[];
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    return [];
  }
}

// 📅 Filtrar órdenes por rango de fechas
export async function getOrdersByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('createdAt', '>=', startDate),
      where('createdAt', '<=', endDate),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Order[];
  } catch (error) {
    console.error("Error fetching orders by date:", error);
    return [];
  }
}

// ✏️ Actualizar estado de orden
export async function updateOrderStatus(
  orderId: string,
  status: Order['status'],
  adminNotes?: string
): Promise<void> {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const updateData: any = {
      status,
      updatedAt: serverTimestamp(),
    };
    
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }
    
    await updateDoc(orderRef, updateData);
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

// 📝 Actualizar notas del admin
export async function updateOrderAdminNotes(orderId: string, adminNotes: string): Promise<void> {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      adminNotes,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating admin notes:", error);
    throw error;
  }
}

// 🗑️ Eliminar orden (opcional, para casos especiales)
export async function deleteOrder(orderId: string): Promise<void> {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await deleteDoc(orderRef);
  } catch (error) {
    console.error("Error deleting order:", error);
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
    let results: Productos[] = [];

    if (mode === "nombre") {
      const searchLower = text.toLowerCase();

      const q = query(
        productsRef,
        where("nombreLower", ">=", searchLower),
        where("nombreLower", "<=", searchLower + "\uf8ff"),
        orderBy("nombreLower"),
        limit(20)
      );

      const snapshot = await getDocs(q);
      results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        subido: doc.data().subido?.toDate() || new Date(),
      })) as Productos[];

    } else if (mode === "categoria") {
      // Búsqueda case-insensitive en categorías
      // Primero traemos todos los productos y filtramos en memoria
      const allProductsQuery = query(productsRef, limit(100));
      const snapshot = await getDocs(allProductsQuery);
      
      const searchLower = text.toLowerCase();
      
      results = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          subido: doc.data().subido?.toDate() || new Date(),
        }))
        .filter((product: any) => {
          // Buscar en el array de categorías (case-insensitive)
          return product.categorias?.some((cat: string) => 
            cat.toLowerCase() === searchLower
          );
        }) as Productos[];
    }

    return results;
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

// ✅ createProduct ya tiene nombreLower
export async function createProduct(
  productData: Omit<Productos, "id" | "subido">
): Promise<string> {
  try {
    const docId = productData.nombre;
    const productRef = doc(db, "productos", docId);

    await setDoc(productRef, {
      ...productData,
      nombreLower: productData.nombre.toLowerCase(), // ← YA ESTÁ AQUÍ
      subido: serverTimestamp(),
    });

    return docId;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

// ✅ updateProduct también actualiza nombreLower si cambias el nombre
export async function updateProduct(
  productId: string,
  productData: Partial<Productos>
): Promise<void> {
  try {
    const productRef = doc(db, "productos", productId);

    const updatedData: any = { ...productData };

    if (productData.nombre) {
      updatedData.nombreLower = productData.nombre.toLowerCase(); // ← YA ESTÁ AQUÍ
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

// ==================== PRODUCTOS POR CATEGORÍA ====================

export async function getProductsByCategory(categorySlug: string, categoryTitle?: string): Promise<Productos[]> {
  try {
    const productsRef = collection(db, 'productos');
    
    // Creamos un array de términos de búsqueda para cubrir ambos casos
    const searchTerms = [categorySlug];
    if (categoryTitle && categoryTitle !== categorySlug) {
      searchTerms.push(categoryTitle);
    }

    const q = query(
      productsRef,
      // Usamos array-contains-any para buscar el slug O el título
      where('categorias', 'array-contains-any', searchTerms),
      orderBy('nombre', 'asc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      subido: doc.data().subido?.toDate() || new Date(),
    })) as Productos[];
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const categoriesRef = collection(db, 'categorias');
    const q = query(categoriesRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      titulo: doc.data().titulo,
      slug: doc.data().slug,
      descripcion: doc.data().descripcion || '',
    };
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

// ==================== GESTIÓN DE STOCK ====================

export async function reduceProductStock(
  productId: string,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const productRef = doc(db, "productos", productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      return { success: false, error: `Producto ${productId} no encontrado` };
    }

    const currentStock = productSnap.data().stock || 0;

    if (currentStock < quantity) {
      return {
        success: false,
        error: `Stock insuficiente para ${productSnap.data().nombre}. Disponible: ${currentStock}, Solicitado: ${quantity}`,
      };
    }

    // Reducir stock
    await updateDoc(productRef, {
      stock: currentStock - quantity,
    });

    console.log(`✅ Stock reducido: ${productSnap.data().nombre} - ${quantity} unidades`);
    return { success: true };
  } catch (error: any) {
    console.error("Error reduciendo stock:", error);
    return { success: false, error: error.message };
  }
}

// Reducir stock de múltiples productos
export async function reduceMultipleProductsStock(
  items: Array<{ productId: string; quantity: number }>
): Promise<{ success: boolean; errors: string[] }> {
  const errors: string[] = [];

  for (const item of items) {
    const result = await reduceProductStock(item.productId, item.quantity);
    if (!result.success) {
      errors.push(result.error || "Error desconocido");
    }
  }

  return {
    success: errors.length === 0,
    errors,
  };
}