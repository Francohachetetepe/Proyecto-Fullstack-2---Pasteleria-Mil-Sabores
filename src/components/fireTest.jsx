/* import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase'; // tu archivo de configuración

const FirebaseTest = () => {
  const testFirebase = async () => {
    try {
      await addDoc(collection(db, 'pruebas'), {
        mensaje: 'Hola desde React!',
        fecha: new Date(),
      });
      console.log('✅ Firebase conectado y funcionando');
    } catch (error) {
      console.error('❌ Error al conectar con Firebase:', error);
    }
  };

  useEffect(() => {
    testFirebase();
  }, []);

  return null; // No muestra nada en pantalla
};

export default FirebaseTest; */