import { useState } from "react";
import { auth } from "../../config/firebase";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const LoginForm = () => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const db = getFirestore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (!correo || !password) {
      setMensaje("❌ Debes completar correo y contraseña.");
      return;
    }

    setMensaje("⏳ Verificando credenciales...");

    try {
      // Intentar login con Firebase Auth (admin o cliente registrado en Auth)
      const userCredential = await auth.signInWithEmailAndPassword(correo, password);
      const user = userCredential.user;

      //Verificar si es el admin
      if (correo === "admin@admin.cl") {
        localStorage.setItem("usuario", JSON.stringify({ nombre: "Administrador", correo, rol: "admin" }));
        setMensaje("✅ Bienvenido Administrador, redirigiendo...");
        setTimeout(() => window.location.href = "../page/home_admin.html", 1000);
        return;
      }

      //Si no es admin, buscar en Firestore para obtener más datos
      const q = query(
        collection(db, "usuario"),
        where("correo", "==", correo)
      );
      const result = await getDocs(q);

      if (!result.empty) {
        const userData = result.docs[0].data();
        localStorage.setItem("usuario", JSON.stringify({ nombre: userData.nombre || correo, correo, rol: "cliente" }));
        setMensaje("✅ Bienvenido Cliente, redirigiendo...");
        setTimeout(() => window.location.href = "../page/saludo.html", 1000);
      } else {
        // Si no está en Firestore, igual lo dejamos pasar como cliente básico
        localStorage.setItem("usuario", JSON.stringify({ nombre: correo, correo, rol: "cliente" }));
        setMensaje("✅ Sesión iniciada, redirigiendo...");
        setTimeout(() => window.location.href = "../page/saludo.html", 1000);
      }

    } catch (error) {
      console.error("Error en login:", error);
      setMensaje("❌ Correo o contraseña incorrectos.");
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

