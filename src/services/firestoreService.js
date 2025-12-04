import {db} from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";

//usuario
export async function addUser(user) {
    try{
        const docRef = await addDoc(collection(db, "usuario"), {
            ...user,
            createdAt: new Date(),
        });
        console.log("Usuario registrado con ID: ", docRef.id);
        return docRef;

    }catch (error) {
        console.error("Error al registrar usuario: ", error);
        return error;

    }
}

//Agregar mensaje en formulario de contacto.
export const addContactMessage = async (contactMessage) => {
  try {
    const docRef = await addDoc(collection(db, "contacto"), {
      email: contactMessage.correo,
      mensaje: contactMessage.mensaje,
      nombre: contactMessage.nombre,
      tipo: contactMessage.tipoMensaje,
      createdAt: new Date(),
    });
    console.log("Mensaje enviado con ID: ", docRef.id);
    return { id: docRef.id };
  } catch (error) {
    console.error("Error al enviar el mensaje: ", error);
    return { error: "Error al guardar el mensaje en Firestore." };
  }
};