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
        throw error;
    }
}