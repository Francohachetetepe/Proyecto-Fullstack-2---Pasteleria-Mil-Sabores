// --- Importaciones funcionales y servicios ---
import { addUser } from "./Services/firestoreService";
import { addContactMessage } from "./Services/firestoreService"; // Asegúrate de importar la función addContactMessage
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
import Ofertas from "./components/pages/Oferta";
import Inicio_sesion from "./components/pages/Inicio_sesion"; // ✅ Agregado para el manejo híbrido

// --- Montaje principal de React ---
document.addEventListener("DOMContentLoaded", () => {
  const rootDiv = document.getElementById("react-root");
  if (!rootDiv) return;

  const root = createRoot(rootDiv);
  const path = window.location.pathname;

  // ✅ Modo híbrido: detecta qué HTML está cargado
  if (path.includes("detalle_product.html")) {
    root.render(<Detalle_product />);
  } else if (path.includes("catalogo.html") || path.includes("catalogo")) {
    root.render(<Catalogo />);
  } else if (path.includes("oferta.html") || path.includes("oferta")) {
    root.render(<Ofertas />);
  } else if (path.includes("inicio_sesion.html")) {
    root.render(<Inicio_sesion />);
  } else {
    // Si no es ninguno de los anteriores, usa el RouterConfig global
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
  const formRegistro = document.getElementById("formUsuario");
  if (!formRegistro) return;

  const runInput = document.getElementById("run");
  const nombreInput = document.getElementById("nombre");
  const apellidosInput = document.getElementById("apellidos");
  const correoInput = document.getElementById("correo");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const codigoPromoInput = document.getElementById("codigoPromo");
  const direccionInput = document.getElementById("direccion");
  const fechaNacimientoInput = document.getElementById("fechaNacimiento");
  const mensajeRegistro = document.getElementById("mensaje");

  formRegistro.addEventListener("submit", async (e) => {
    e.preventDefault();
    mensajeRegistro.innerText = "";

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
    const rol="Usuario";

    // --- Validaciones ---
    if (!validarRun(run)) return (mensajeRegistro.innerText = "Run incorrecto");
    if (!nombre) return (mensajeRegistro.innerText = "Nombre en blanco");
    if (!apellidos) return (mensajeRegistro.innerText = "Apellidos en blanco");
    if (!validarCorreo(correo))
      return (mensajeRegistro.innerText =
        "Correo inválido. Solo se permite @duoc.cl, @profesor.duoc.cl o @gmail.com");
    if (!validarPassword(password))
      return (mensajeRegistro.innerText = "Contraseña debe tener más de 4 caracteres");
    if (!validarPasswordsIguales(password, confirmPassword))
      return (mensajeRegistro.innerText = "Las contraseñas no coinciden");
    if (!validarCodigoPromo(codigo))
      return (mensajeRegistro.innerText = "Código promocional inválido");
    if (!region || !comuna)
      return (mensajeRegistro.innerText = "Debe seleccionar una región y comuna");

    const edad = validarEdad(fechaNacimiento);
    if (edad > 0 && edad < 18) {
      mensajeRegistro.innerText =
        "Eres menor de 18 años, ¡pide a un adulto que te supervise en las compras!";
    }

    // --- Descuentos ---
    let descuento = 0;

    // Descuentos permanentes
    if (codigo === "FELICES50") {
      descuento = 10;
    } else if (edad >= 50) {
      descuento = 50;
    }

    // Descuentos temporales
    const [anio, mes, dia] = fechaNacimiento.split("-").map(Number);
    const hoy = new Date();
    const esCumpleHoy = dia === hoy.getDate() && (mes - 1) === hoy.getMonth();
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
        rol,
      });

      mensajeRegistro.innerText = "El formulario fue enviado correctamente :)";

      setTimeout(() => {
        // 🔁 Redirigir usando ruta HTML estática, no Router
        window.location.href = "/assets/page/inicio_sesion.html";
      }, 1000);
    } catch (error) {
      console.error("Error al guardar usuario: ", error);
      mensajeRegistro.innerText = "Error al guardar usuario en Firebase";
    }
  });

  console.log("Usuario ingresado:", JSON.parse(localStorage.getItem("usuario")));
});

// --- Código de manejo del formulario de contacto ---
document.addEventListener("DOMContentLoaded", () => {
  const formContacto = document.getElementById("formContacto");
  if (!formContacto) return;

  const nombreContactoInput = document.getElementById("nombreContacto");
  const correoContactoInput = document.getElementById("correoContacto");
  const tipoMensajeInput = document.getElementById("tipoMensajeContacto");
  const mensajeContactoInput = document.getElementById("mensajeContacto");
  const mensajeEnv = document.getElementById("mensajeEnv");

  formContacto.addEventListener("submit", async (e) => {
    e.preventDefault();
    mensajeEnv.innerText = ""; // Limpiar mensaje de error/success

    const nombre = nombreContactoInput.value.trim();
    const correo = correoContactoInput.value.trim();
    const tipoMensaje = tipoMensajeInput.value;
    const mensaje = mensajeContactoInput.value.trim();

    // --- Validaciones ---
    if (!nombre) {
      mensajeEnv.innerText = "El nombre es obligatorio.";
      return;
    }
    if (!validarCorreo(correo)) {
      mensajeEnv.innerText = "Correo inválido. Solo se permite @duoc.cl, @profesor.duoc.cl o @gmail.com";
      return;
    }
    if (!mensaje) {
      mensajeEnv.innerText = "El mensaje es obligatorio.";
      return;
    }
    if (!tipoMensaje) {
      mensajeEnv.innerText = "Selecciona un tipo de mensaje.";
      return;
    }

    try {
      const result = await addContactMessage({ nombre, correo, tipoMensaje, mensaje });

      if (result.id) {
        console.log("Mensaje enviado con éxito", result);
        mensajeEnv.innerText = "Mensaje enviado con éxito.";
      } else {
        mensajeEnv.innerText = "Error al enviar el mensaje. Por favor intente nuevamente.";
      }
    } catch (error) {
      mensajeEnv.innerText = "Error al enviar el mensaje. Por favor intente más tarde.";
    }
  });
});
