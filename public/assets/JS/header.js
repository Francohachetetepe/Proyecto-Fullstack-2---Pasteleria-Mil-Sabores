document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header-usuario");
  if (!header) return;

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (usuario) {
    // Usuario registrado: dropdown
    header.innerHTML = `
      <div class="dropdown-usuario">
        <button class="dropdown-toggle">
          <i class="bi bi-person-circle" style="font-size: 1.5rem;"></i>
          <span>${usuario.nombre}</span>
        </button>
        <div class="dropdown-menu">
          <a href="saludo.html" class="dropdown-item">Mi perfil</a>
          <button id="cerrar-sesion" class="dropdown-item">Cerrar sesión</button>
        </div>
      </div>
    `;

    const toggle = header.querySelector(".dropdown-toggle");
    const menu = header.querySelector(".dropdown-menu");
    const btnCerrar = document.getElementById("cerrar-sesion");

    // Mostrar/ocultar menú
    toggle.addEventListener("click", (e) => {
      e.stopPropagation(); // evita que se cierre al hacer clic dentro
      menu.classList.toggle("show");
    });

    // Cerrar sesión
    btnCerrar.addEventListener("click", () => {
      localStorage.removeItem("usuario");
      location.reload();
    });

    // Cerrar dropdown al hacer clic fuera
    document.addEventListener("click", (e) => {
      if (!header.contains(e.target)) {
        menu.classList.remove("show");
      }
    });
  } else {
    // Usuario no registrado: botones
    header.innerHTML = `
      <button class="btn-login" onclick="window.location.href='inicio_sesion.html'">Iniciar Sesión</button>
      <button class="btn-signup" onclick="window.location.href='crear_cuenta.html'">Crear Cuenta</button>
    `;
  }
});
