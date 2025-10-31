document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header-usuario");
  if (!header) return;

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (usuario) {
    header.innerHTML = `
      <div class="usuario-info d-flex flex-column align-items-start gap-2">
        <div class="d-flex align-items-center gap-2">
          <i class="bi bi-person-circle" style="font-size: 1.5rem;"></i>
          <span><strong>${usuario.nombre}</strong></span>
        </div>
        <div class="d-flex gap-2">
          <a href="saludo.html" class="btn btn-sm btn-outline-primary">Mi perfil</a>
          <button id="cerrar-sesion" class="btn btn-sm btn-outline-danger">Cerrar sesión</button>
        </div>
      </div>
    `;

    document.getElementById("cerrar-sesion").addEventListener("click", () => {
      localStorage.removeItem("usuario");
      location.reload();
    });
  } else {
    header.innerHTML = `
      <button class="btn-login" onclick="window.location.href='inicio_sesion.html'">Iniciar Sesión</button>
      <button class="btn-signup" onclick="window.location.href='registro_usuario.html'">Crear Cuenta</button>
    `;
  }
});