//Contacto
//validar correo
 function validarCorreo(correo) {
    const regex = /^[\w.+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
    return regex.test(correo);
}
//boton
document.addEventListener("DOMContentLoaded" , () => {
    const formulario = document.querySelector(".formulario_contacto"); //chatgpt me digo que le pusiera esto, pero la profe no lo hizo asiiii, será porque usé bootstrap?
    const nombreInput = document.getElementById("nombre");
    const correoInput = document.getElementById("correo");
    const mensajeInput = document.getElementById("mensaje");
    const mensajeAlert = document.getElementById("mensajeEnv"); //pongo esto solo porque no me funciona nadaaa



    //limpiar mensaje al ingresar datos en el imput
    [nombreInput, correoInput, mensajeInput].forEach(input => {
        input.addEventListener ("input", () => {
            input.setCustomValidity ("");
            mensaje.innerText= "";
        });
    });

    //conecta el formulario con todo esto
    formulario.addEventListener("submit", function(e) {
        e.preventDefault();

        //limpiar mensaje sprevios

        mensajeInput.innerText = "";

        //validar que no esten vacíos
        //nombre

        if(!nombreInput.value.trim() || !correoInput.value.trim() || !mensajeInput.value.trim()) {
            alert("Rellene todos los campos :)");
            return;
        }

        //validar correo
        //también me dijo que cambiara esto (la validación no me está funcioando)
        if(!validarCorreo(correoInput.value.trim())){
            alert("El correo debe ser '@duoc.cl', '@profesor.duoc.cl', '@gmail.com'.");
            return;
        }

        // mensaje "todo bien"
        mensajeAlert.innerText = "Mensaje enviado correctamente. Lo contactaremos a la brevedad."; //no me convence el mensaje xd
        
        //Todos los datos son correctos
        const nombreUsuario = nombreInput.value.trim();
        const correoValue = correoInput.value.trim().toLowerCase();

        //redireccionar
        //no sé si deba hacer esto, lo dejo comentado, yyy, lo direcciono a index
        //const destino = correoValue.toLowerCase() === "admin@duoc.cl" ?
        //`assets/index.html?nombre=${encodeURIComponent(nombreUsuario)}` : 
        //`assets/index.html?nombre=${encodeURIComponent(nombreUsuario)}`;

        //setTimeout(() =>{
        //    window.location.href = destino;
        //}, 1000);

    
    }); 
});

