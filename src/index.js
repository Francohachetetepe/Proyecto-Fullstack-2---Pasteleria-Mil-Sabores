import { addUser } from "./Services/firestoreService";
import {validarRun, validarCorreo, validarPassword, validarPasswordsIguales, validarCodigoPromo, validarEdad} from "./utils/validaciones";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "./config/firebase";


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
     
     const [anio, mes, dia] = fechaNacimiento.split("-").map(Number); 
     const hoy = new Date();
     const esCumpleHoy = dia === hoy.getDate() && (mes - 1) === hoy.getMonth();
     const esCorreoDuoc = correo.toLowerCase().endsWith("@duoc.cl");


     if (codigo === "FELICES50") {
      descuento = 10; 
     }
     
     if (edad >= 50){
      descuento = 50;
     }

     if (esCumpleHoy && esCorreoDuoc) {
      descuento = 100; //solo sirve en el cumpleaños
     }
  


     try{
      await addUser({run, nombre, apellidos, 
        correo, password, confirmPassword, 
        region, comuna, codigoPromo: codigo, 
        descuento, direccion, fechaNacimiento}); 
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