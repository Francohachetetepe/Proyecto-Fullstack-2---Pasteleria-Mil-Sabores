document.addEventListener("DOMContentLoaded", () => {
    const bienvenido = document.getElementById("bienvenido");
    if (!bienvenido) return;


    const usuarioStr = localStorage.getItem("usuario");
    if (!usuarioStr) {
        bienvenido.innerText = "Bienvenido!";
        return;
    }

    const usuario = JSON.parse(usuarioStr);
    bienvenido.innerText = `Bienvenido ${usuario.nombre}!`;
});

const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleSidebar");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("expanded");
});


document.addEventListener("DOMContentLoaded", () => {
  // --- BOTONES DE NAVEGACIÓN ---
  /*const btnTienda = document.getElementById("btnTienda");

  if (btnTienda) {
    btnTienda.addEventListener("click", () => {
      window.location.href = "../../index.html"; 
    });
  }*/

    const btnCerrarSesion = document.getElementById("cerrarSesion");

  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", () => {
      localStorage.removeItem("usuario");
      window.location.href = "../page/inicio_sesion.html";
    });
  }

  console.log("Usuario ingresado:", JSON.parse(localStorage.getItem("usuario")));

});
