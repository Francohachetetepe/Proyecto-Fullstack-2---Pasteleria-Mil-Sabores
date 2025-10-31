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
      if (correo === "admin@admin.cl") {
        await auth.signInWithEmailAndPassword(correo, password);
        localStorage.setItem("usuario", JSON.stringify({ nombre: "Administrador", correo, rol: "admin" }));
        setMensaje("✅ Bienvenido Administrador, redirigiendo...");
        setTimeout(() => window.location.href = "../page/home_admin.html", 1000);
        return;
      }

      const q = query(
        collection(db, "usuario"),
        where("correo", "==", correo),
        where("password", "==", password)
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
      console.error("Error en login:", error);
      setMensaje("❌ Error al verificar usuario.");
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


/*import { useEffect } from "react";
import { auth } from "../../config/firebase";

const Registro_usuario = () => {
  useEffect(() => {
    const form = document.getElementById("formLogin");
    const togglePass = document.getElementById("togglePass");
    const mensajeLogin = document.getElementById("mensajeLogin");
    const passwordInput = document.getElementById("password");

    // 🔹 Mostrar/ocultar contraseña
    togglePass?.addEventListener("click", () => {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePass.textContent = "Ocultar";
      } else {
        passwordInput.type = "password";
        togglePass.textContent = "Mostrar";
      }
    });

    // 🔹 Login con Firebase Auth
    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const correo = document.getElementById("correo").value;
      const password = passwordInput.value;

      try {
        await auth.signInWithEmailAndPassword(correo, password);
        mensajeLogin.textContent = "✅ Sesión iniciada correctamente.";
        mensajeLogin.style.color = "green";

        setTimeout(() => {
          window.location.href = "../../index.html";
        }, 1500);
      } catch (error) {
        mensajeLogin.textContent =
          "❌ Error: correo o contraseña incorrectos.";
        mensajeLogin.style.color = "brown";
      }
    });
  }, []);

  return null;
};

export default Registro_usuario;*/
