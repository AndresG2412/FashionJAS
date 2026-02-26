import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "./config";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

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
  };
  shipping: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
  items: OrderItem[];
  payment: {
    method: string;
    status: string;
    amount: number;
  };
  total: number;
  subtotal: number;
  shippingCost: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function createOrder(orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<string> {
  try {
    const ordersRef = collection(db, "orders");
    const docRef = await addDoc(ordersRef, {
      ...orderData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Order[];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export async function updateOrderStatus(orderId: string, status: Order["status"]): Promise<void> {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}