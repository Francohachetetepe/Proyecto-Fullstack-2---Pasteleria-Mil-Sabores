

/* al usar react, esto ya no es necesario*/
/*document.addEventListener("DOMContentLoaded", () => {

  const formLogin = document.getElementById("formLogin");
  const mensaje = document.getElementById("mensajeLogin");
  const correoInput = document.getElementById("correo");
  const passwordInput = document.getElementById("password");

  if(!formLogin) return console.error("No se encontro #formUsuario")

    //iniciar bd
    const firebaseConfig = {
        apiKey: "AIzaSyAzRg6nsE4TZgdvMeeU7Nvjo64k7m8HrrE",
        authDomain: "tiendapasteleriamilsabor-de980.firebaseapp.com",
        projectId: "tiendapasteleriamilsabor-de980",
        storageBucket: "tiendapasteleriamilsabor-de980.appspot.com",
        messagingSenderId: "925496431859",
        appId: "1:925496431859:web:ff7f0ae09b002fe94e5386",
        measurementId: "G-1X6TSB46XN"
    };

    if (!firebase.apps?.length) {
        firebase.initializeApp(firebaseConfig);
    }

    const auth = firebase.auth(); 
    const db = firebase.firestore(); 



    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const correo = correoInput.value.trim().toLowerCase();
        const password = passwordInput.value.trim();
        
        //si está vacío
        if (!correo || !password) {
            mensaje.style.color = "red";
            mensaje.innerText = "Debe completar correo y contraseña";
            return;
        }

        // Mensaje mientras verifica
        mensaje.style.color = "gray";
        mensaje.innerText = "Verificando credenciales...";


        //evitar errores de auth
        let autenticado = false;

        // Admin: autenticar con Firebase Auth
     if (correo === "admin@admin.cl") {
        try {
            await auth.signInWithEmailAndPassword(correo, password);
            autenticado = true;
            // Guardar usuario en localStorage
            const usuario = { nombre: "Administrador", correo, rol: "admin" };
            localStorage.setItem("usuario", JSON.stringify(usuario));

            mensaje.style.color = "green";
            mensaje.innerText = "Bienvenido Administrador, redirigiendo...";
            
            
            setTimeout(() => {
                window.location.href = `../page/home_admin.html`;
            }, 1000);
        } catch (error) {
            console.error("Error login admin:", error);
            mensaje.style.color = "red";
            mensaje.innerText = "Credenciales incorrectas para administrador";
            return;
        }
        return;
    }

    // Cliente: validar desde Firestore

    if(!autenticado) {
        try {
        const query = await db.collection("usuario")
            .where("correo", "==", correo)
            .where("password", "==", password)
            .get();

        if (!query.empty) {
            const userData = query.docs[0].data();
            const nombre = userData.nombre || correo;

            // Guardar usuario en localStorage con rol real
            const usuario = { nombre, correo, rol: "cliente" };
            localStorage.setItem("usuario", JSON.stringify(usuario));

            autenticado = true; 
            mensaje.style.color = "green";
            mensaje.innerText = "Bienvenido Cliente, redirigiendo...";
            
            setTimeout(() => {
                window.location.href = `../page/saludo.html`;
            }, 1000);
        } else {
            mensaje.style.color = "red";
            mensaje.innerText = "Correo o contraseña incorrectos";
            return;
        }
    } catch (error) {
        console.error("Error login cliente:", error);
        mensaje.style.color = "red";
        mensaje.innerText = "Error al verificar usuario";
        return;
    }};

    });


});*/
