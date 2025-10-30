import { useEffect } from "react";
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

export default Registro_usuario;
