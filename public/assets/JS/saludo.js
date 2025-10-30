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