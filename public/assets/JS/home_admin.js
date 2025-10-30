document.addEventListener("DOMContentLoaded", () => {
  // --- BOTONES DE NAVEGACIÓN ---
  const btnTienda = document.getElementById("btnTienda");
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");

  if (btnTienda) {
    btnTienda.addEventListener("click", () => {
      window.location.href = "../../index.html"; 
    });
  }

  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", () => {
      localStorage.removeItem("usuario");
      window.location.href = "../page/inicio_sesion.html";
    });
  }

  console.log("Usuario ingresado:", JSON.parse(localStorage.getItem("usuario")));

});
