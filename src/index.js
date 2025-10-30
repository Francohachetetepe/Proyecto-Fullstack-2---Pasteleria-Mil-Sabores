import { addUser } from "./Services/firestoreService";
import {validarRun, validarCorreo, validarPassword, validarPasswordsIguales, validarCodigoPromo, validarEdad} from "./utils/validaciones";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "./config/firebase";
import React from "react";
import { createRoot } from "react-dom/client";
import Blogs from "./components/pages/Blogs";
import Carrito from "./components/pages/Carrito";
import Checkout from "./components/pages/Checkout";
import Catalogo from "./components/pages/Catalogo";
import CompraExitosa from "./components/pages/CompraExitosa";
import Contacto from "./components/pages/Contacto";
import Detalle_product from "./components/pages/Detalle_product";
import ErrorPago from "./components/pages/ErrorPago";
import Home_admin from "./components/pages/Home_admin";
import Home from "./components/pages/Home";
import Inicio_sesion from "./components/pages/Inicio_sesion";
import Nosotros from "./components/pages/Nosotros";
import PerfilCliente from "./components/pages/PerfilCliente";
import Productos from "./components/pages/Productos";
import Registro_usuario from "./components/pages/Registro_usuario";
import Oferta from "./components/pages/Oferta";
document.addEventListener("DOMContentLoaded", () => {
  const rootDiv = document.getElementById("react-root");
  if (!rootDiv) return; // No hay contenedor, salir

  const path = window.location.pathname;
  const root = createRoot(rootDiv);

  if (path.includes("catalogo")) root.render(<Catalogo />);
  else if (path.includes("carrito")) root.render(<Carrito />);
  else if (path.includes("checkout")) root.render(<Checkout />);
  else if (path.includes("blogs")) root.render(<Blogs />);
  else if (path.includes("contacto")) root.render(<Contacto />);
  else if (path.includes("home_admin")) root.render(<Home_admin />);
  else if (path.includes("errorPago")) root.render(<ErrorPago />);
  else if (path.includes("detalle_product")) root.render(<Detalle_product />);
  else if (path.includes("inicio_sesion")) root.render(<Inicio_sesion />);
  else if (path.includes("nosotros")) root.render(<Nosotros />);
  else if (path.includes("perfilCliente")) root.render(<PerfilCliente />);
  else if (path.includes("oferta")) root.render(<Oferta />);
  else if (path.includes("registro_usuario")) root.render(<Registro_usuario />);
  else if (path.includes("compraExitosa")) root.render(<CompraExitosa />);
  else root.render(<Home />);
});

function esPaginaEstatica() {
  return window.location.pathname.includes('.html') || 
         window.location.pathname.includes('/assets/');
}

document.addEventListener("DOMContentLoaded", () => {

  //Region y comuna
  const regionSelect = document.getElementById("region");
  const comunaSelect = document.getElementById("comuna");
  
  if(regionSelect && comunaSelect) {
    async function cargarRegiones() {
      const regionesSnapshot = await getDocs(collection(db, "region"));
      regionesSnapshot.forEach(doc => {
        const data = doc.data();
        const option = document.createElement("option");
        option.value = doc.id;
        option.textContent = data.nombre;
        regionSelect.appendChild(option);
      });
    }
    
    regionSelect.addEventListener("change", async () => {
      comunaSelect.innerHTML = '<option value="">-- Seleccione la comuna --</option>';
      const regionId = regionSelect.value;
      if (!regionId) return;
      const regionesSnapshot = await getDocs(collection(db, "region"));
      regionesSnapshot.forEach(doc => {
        if(doc.id === regionId){
          const comunas = doc.data().comuna; 
          comunas.forEach(c => {
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


  //formulario de registro

  const form = document.getElementById("formUsuario");
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

  if(!form) return console.log("No se encontro #formUsuario")

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      mensaje.innerText = "" ;

      const run = runInput.value.trim().toUpperCase();
      const nombre = nombreInput.value.trim();
      const apellidos = apellidosInput.value.trim();
      const correo = correoInput.value.trim();
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;
      const region = regionSelect.value;
      const comuna = comunaSelect.value;
      const codigo = codigoPromoInput.value.trim().toUpperCase();
      const direccion = direccionInput.value.trim();
      const fechaNacimiento = fechaNacimientoInput.value;


     //validar el ingreso correcto de los datos
     if(!validarRun(run)) return mensaje.innerText = "Run incorrecto";
     else if(!nombre) return mensaje.innerText = "Nombre en blanco"; 
     else if(!apellidos) return mensaje.innerText = "Apellidos en blanco";  
     else if(!validarCorreo(correo)) return mensaje.innerText = "Correo inválido, debe ser '@duoc.cl, @profesor.duoc.cl o @gmail.com'"; 
     else if(!validarPassword(password)) return mensaje.innerText = "Contraseña debe tener más de 4 caractes";
     else if(!validarPasswordsIguales(password, confirmPassword)) return mensaje.innerText = "Las contraseñas no coinciden"; 
     else if (!validarCodigoPromo(codigo)) return mensaje.innerText = "Código inválido"
     else if (!region || !comuna) return mensaje.innerText = "Debe seleccionar una región y comuna"

     //para menores de edad
     const edad = validarEdad(fechaNacimiento)
     if (edad > 0 && edad < 18) {
      mensaje.innerText = "Eres menor de 18 años, ¡pide a un adulto que te supervice en las compras!";
     }

     //descuentos
     let descuento = 0;

// --- descuentos permanentes ---
if (codigo === "FELICES50") {
  descuento = 10; // código fijo
} else if (edad >= 50) {
  descuento = 50; // descuento por edad
}

// --- descuentos temporales ---
const [anio, mes, dia] = fechaNacimiento.split("-").map(Number);
const hoy = new Date();
const esCumpleHoy = dia === hoy.getDate() && (mes - 1) === hoy.getMonth();
const esCorreoDuoc = correo.toLowerCase().endsWith("@duoc.cl");

// esta variable solo indica si hoy tiene descuento, no lo aplica en BD
const tieneCumpleHoy = esCumpleHoy && esCorreoDuoc;

     try{
      await addUser({run, nombre, apellidos, 
        correo, password, confirmPassword, 
        region, comuna, codigoPromo: codigo, 
        descuento, direccion, fechaNacimiento, tieneCumpleHoy}); 
      mensaje.innerText = "El formulario fue enviado correctamente :) ";
      
      setTimeout(() => { 
        window.location.href = "/assets/page/inicio_sesion.html";
      }, 1000);

     } catch (error) {
      console.error("Error al guardar usuario: ", error);
      mensaje.innerText = "Error al guardar usuario en Firebase"

     }
    });
});