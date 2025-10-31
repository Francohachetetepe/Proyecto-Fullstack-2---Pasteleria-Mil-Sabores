import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

const LoginForm = () => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (!correo || !password) {
      setMensaje("❌ Debes completar correo y contraseña.");
      return;
    }

    setMensaje("⏳ Verificando credenciales...");

    // Si es el admin, usar Firebase Auth
    if (correo === "admin@admin.cl") {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, correo, password);
        localStorage.setItem("usuario", JSON.stringify({ nombre: "Administrador", correo, rol: "admin" }));
        setMensaje("✅ Bienvenido Administrador, redirigiendo...");
        setTimeout(() => window.location.href = "../page/home_admin.html", 1000);
        return;
      } catch (error) {
        console.error("Error en login admin:", error);
        setMensaje("❌ Correo o contraseña incorrectos para administrador.");
        return;
      }
    }

    // Buscar cliente en Firestore
    try {
      const q = query(
        collection(db, "usuario"),
        where("correo", "==", correo),
        where("password", "==", password) // ⚠️ Solo si estás guardando la contraseña en texto plano
      );
      const result = await getDocs(q);

      if (!result.empty) {
        const userData = result.docs[0].data();
        localStorage.setItem("usuario", JSON.stringify({ nombre: userData.nombre || correo, correo, rol: "cliente" }));
        setMensaje("✅ Bienvenido Cliente, redirigiendo...");
        setTimeout(() => window.location.href = "../page/saludo.html", 1000);
      } else {
        setMensaje("❌ Correo o contraseña incorrectos.");
      }
    } catch (error) {
      console.error("Error en login cliente:", error);
      setMensaje("❌ Error al verificar credenciales.");
    }
  };

  return (
    <main className="registro-container" style={{ maxWidth: "400px", margin: "40px auto", padding: "20px" }}>
      <h2 className="mb-4 text-center">Iniciar sesión con su cuenta</h2>
      <form onSubmit={handleLogin} className="p-4 border rounded bg-light">
        <div className="form-group mb-3">
          <label htmlFor="correo">Escribe aquí tu email</label>
          <input
            type="email"
            className="form-control"
            id="correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <div className="form-group mb-3 position-relative">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Iniciar sesión</button>
        <p style={{ color: "brown", marginTop: "10px" }}>{mensaje}</p>

        <p className="mt-3 text-center">
          ¿No tiene una cuenta? <a href="registro_usuario.html">Cree una aquí</a>
        </p>
      </form>
    </main>
  );
};

export default LoginForm;
