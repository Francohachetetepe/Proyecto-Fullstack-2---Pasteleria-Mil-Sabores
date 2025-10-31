// --- Importaciones funcionales y servicios ---
import { addUser } from "./Services/firestoreService";
import {
  validarRun,
  validarCorreo,
  validarPassword,
  validarPasswordsIguales,
  validarCodigoPromo,
  validarEdad,
} from "./utils/validaciones";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./config/firebase";

// --- React y componentes individuales ---
import React from "react";
import { createRoot } from "react-dom/client";
import RouterConfig from "./routes/RouterConfig";
import Detalle_product from "./components/pages/Detalle_product";
import Catalogo from "./components/pages/Catalogo";
import Ofertas from "./components/pages/Oferta"; // ✅ Importación agregada

// --- Montaje principal de React ---
document.addEventListener("DOMContentLoaded", () => {
  const rootDiv = document.getElementById("react-root");
  if (!rootDiv) return;

  const root = createRoot(rootDiv);
  const path = window.location.pathname;

  // ✅ Montaje según página actual (modo híbrido)
  if (path.includes("detalle_product.html")) {
    root.render(<Detalle_product />);
  } else if (path.includes("catalogo")) {
    root.render(<Catalogo />);
  } else if (path.includes("oferta")) {
    root.render(<Ofertas />);
  } else {
    // En todas las demás páginas se mantiene el RouterConfig general
    root.render(<RouterConfig />);
  }
});

// =============================================================
// 🚀 CÓDIGO DE FUNCIONALIDAD GENERAL (Formularios, Regiones, etc.)
// =============================================================

document.addEventListener("DOMContentLoaded", () => {
  // --- Región y Comuna ---
  const regionSelect = document.getElementById("region");
  const comunaSelect = document.getElementById("comuna");

  if (regionSelect && comunaSelect) {
    async function cargarRegiones() {
      const regionesSnapshot = await getDocs(collection(db, "region"));
      regionesSnapshot.forEach((doc) => {
        const data = doc.data();
        const option = document.createElement("option");
        option.value = doc.id;
        option.textContent = data.nombre;
        regionSelect.appendChild(option);
      });
    }

    regionSelect.addEventListener("change", async () => {
      comunaSelect.innerHTML =
        '<option value="">-- Seleccione la comuna --</option>';
      const regionId = regionSelect.value;
      if (!regionId) return;

      const regionesSnapshot = await getDocs(collection(db, "region"));
      regionesSnapshot.forEach((doc) => {
        if (doc.id === regionId) {
          const comunas = doc.data().comuna;
          comunas.forEach((c) => {
            const option = document.createElement("option");
            option.value = c;
            option.textContent = c;
            comunaSelect.appendChild(option);
          });
        }
      });
    });

    cargarRegiones();
  }

  // --- Formulario de registro ---
  const form = document.getElementById("formUsuario");
  if (!form) return;

  const runInput = document.getElementById("run");
  const nombreInput = document.getElementById("nombre");
  const apellidosInput = document.getElementById("apellidos");
  const correoInput = document.getElementById("correo");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const codigoPromoInput = document.getElementById("codigoPromo");
  const direccionInput = document.getElementById("direccion");
  const fechaNacimientoInput = document.getElementById("fechaNacimiento");
  const mensaje = document.getElementById("mensaje");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    mensaje.innerText = "";

    const run = runInput.value.trim().toUpperCase();
    const nombre = nombreInput.value.trim();
    const apellidos = apellidosInput.value.trim();
    const correo = correoInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const region = regionSelect?.value;
    const comuna = comunaSelect?.value;
    const codigo = codigoPromoInput.value.trim().toUpperCase();
    const direccion = direccionInput.value.trim();
    const fechaNacimiento = fechaNacimientoInput.value;

    // --- Validaciones ---
    if (!validarRun(run)) return (mensaje.innerText = "Run incorrecto");
    if (!nombre) return (mensaje.innerText = "Nombre en blanco");
    if (!apellidos) return (mensaje.innerText = "Apellidos en blanco");
    if (!validarCorreo(correo))
      return (mensaje.innerText =
        "Correo inválido. Solo se permite @duoc.cl, @profesor.duoc.cl o @gmail.com");
    if (!validarPassword(password))
      return (mensaje.innerText = "Contraseña debe tener más de 4 caracteres");
    if (!validarPasswordsIguales(password, confirmPassword))
      return (mensaje.innerText = "Las contraseñas no coinciden");
    if (!validarCodigoPromo(codigo))
      return (mensaje.innerText = "Código promocional inválido");
    if (!region || !comuna)
      return (mensaje.innerText = "Debe seleccionar una región y comuna");

    const edad = validarEdad(fechaNacimiento);
    if (edad > 0 && edad < 18) {
      mensaje.innerText =
        "Eres menor de 18 años, ¡pide a un adulto que te supervise en las compras!";
    }

    // --- Descuentos ---
    let descuento = 0;
    if (codigo === "FELICES50") descuento = 10;
    else if (edad >= 50) descuento = 50;

    const [anio, mes, dia] = fechaNacimiento.split("-").map(Number);
    const hoy = new Date();
    const esCumpleHoy = dia === hoy.getDate() && mes - 1 === hoy.getMonth();
    const esCorreoDuoc = correo.toLowerCase().endsWith("@duoc.cl");
    const tieneCumpleHoy = esCumpleHoy && esCorreoDuoc;

    try {
      await addUser({
        run,
        nombre,
        apellidos,
        correo,
        password,
        confirmPassword,
        region,
        comuna,
        codigoPromo: codigo,
        descuento,
        direccion,
        fechaNacimiento,
        tieneCumpleHoy,
      });

      mensaje.innerText = "El formulario fue enviado correctamente :)";

      setTimeout(() => {
        window.location.href = "/assets/page/inicio_sesion.html";
      }, 1000);
    } catch (error) {
      console.error("Error al guardar usuario: ", error);
      mensaje.innerText = "Error al guardar usuario en Firebase";
    }
  });
});
