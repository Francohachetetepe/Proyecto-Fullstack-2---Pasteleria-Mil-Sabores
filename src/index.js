import { addUser } from "./Services/firestoreService";
import {validarRun, validarCorreo, validarPassword, validarEdad} from "./utils/validaciones";
//preguntar si se pone validarCamposVacios y validarCodigoPromo

function esPaginaEstatica() {
  return window.location.pathname.includes('.html') || 
         window.location.pathname.includes('/assets/');
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formUsuario");
  const runInput = document.getElementById("run");
  const nombreInput = document.getElementById("nombre");
  const apellidosInput = document.getElementById("apellidos");
  const correoInput = document.getElementById("correo");
  const contrasenaInput = document.getElementById("contrasena");
  const fechaNacimientoInput = document.getElementById("fecha_nacimiento");
  const mensaje = document.getElementById("mensaje");

  //validación de conexión
  if(!form) return console.log("No se encontro #formUsuario")

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      mensaje.innerText = "" ;

      const run = runInput.value.trim().toUpperCase();
      const nombre = nombreInput.value.trim();
      const apellidos = apellidosInput.value.trim();
      const correo = correoInput.value.trim();
      const contrasena = contrasenaInput.value;
      const fecha_nacimiento = fechaNacimientoInput.value;


     //validar el ingreso correcto de los datos
     if(!validarRun(run)) return mensaje.innerText = "Run incorrecto"; 
     if(!nombre) return mensaje.innerText = "Nombre en blanco"; 
     if(!apellidos) return mensaje.innerText = "Apellidos en blanco";  
     if(!validarCorreo(correo)) return mensaje.innerText = "Correo incorrecto"; 
     if(!validarPassword(contrasena)) return mensaje.innerText = "Contraseña debe tener más de 6 dígitos";
     if(!validarEdad(fecha_nacimiento)) return mensaje.innerText = "tiene x años"; //la verdad no sé que poner aquí, o si va, esta validación es para el código promocional

    
     try{
      await addUser({run, nombre, apellidos, correo, contrasena, fecha_nacimiento});
      mensaje.innerText = "El formulario fue enviado correctamente :) ";
      
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1000);

     } catch (error) {
      console.error("Error al guardar usuario: ", error);
      mensaje.innerText = "Error al guardar usuario en Firebase"

     }
    });
});