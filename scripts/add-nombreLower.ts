import { db } from '@/lib/firebase/config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

async function addNombreLowerToProducts() {
  try {
    const productsRef = collection(db, 'productos');
    const snapshot = await getDocs(productsRef);
    
    console.log(`Encontrados ${snapshot.size} productos`);
    
    let updated = 0;
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      
      if (!data.nombreLower && data.nombre) {
        await updateDoc(doc(db, 'productos', docSnap.id), {
          nombreLower: data.nombre.toLowerCase()
        });
        console.log(`✅ Actualizado: ${data.nombre}`);
        updated++;
      }
    }
    
    console.log(`\n✨ ${updated} productos actualizados con nombreLower`);
  } catch (error) {
    console.error('Error:', error);
  }
}

addNombreLowerToProducts();