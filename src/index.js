import { addUser } from "./Services/firestoreService";
import {validarRun, validarCorreo, validarPassword, validarPasswordsIguales, validarEdad} from "./utils/validaciones";


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
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const fechaNacimientoInput = document.getElementById("fechaNacimiento");
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
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;
      const fechaNacimiento = fechaNacimientoInput.value;


     //validar el ingreso correcto de los datos
     if(!validarRun(run)) return mensaje.innerText = "Run incorrecto";
     else if(!nombre) return mensaje.innerText = "Nombre en blanco"; 
     else if(!apellidos) return mensaje.innerText = "Apellidos en blanco";  
     else if(!validarCorreo(correo)) return mensaje.innerText = "Correo incorrecto"; 
     else if(!validarPassword(password)) return mensaje.innerText = "Contraseña debe tener más de 6 dígitos";
     else if(!validarPasswordsIguales(password, confirmPassword)) return mensaje.innerText = "Las contraseñas no coinciden"; 
     else if(!validarEdad(fechaNacimiento)) return mensaje.innerText = "Debes ser mayor de 18 años para registrarte";

    
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