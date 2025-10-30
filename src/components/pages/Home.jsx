import { useEffect } from "react";
import { db } from "../../config/firebase"; // si planeas usar Firestore

const Home = () => {
  useEffect(() => {

    const usuario = localStorage.getItem("usuarioActual");
    if (usuario) {
      const textoUsuario = document.getElementById("textoUsuario");
      if (textoUsuario) textoUsuario.textContent = "Mi perfil";
    }

    // Si quisieras en el futuro cargar productos dinámicos, se haría aquí:
    /*
    const cargarProductosDestacados = async () => {
      const snapshot = await db.collection("producto").limit(4).get();
      const destacados = snapshot.docs.map(doc => doc.data());
      console.log("Productos destacados:", destacados);
    };
    cargarProductosDestacados();
    */
  }, []);
  return null;
};

export default Home;