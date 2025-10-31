document.addEventListener("DOMContentLoaded", () => {
  // ⏳ Espera breve para asegurar que bundle.js ya haya renderizado todo
  setTimeout(() => {
    const header = document.getElementById("header-usuario");
    if (!header) {
      console.warn("⚠️ No se encontró el elemento #header-usuario. Revisa que exista en el HTML.");
      return;
    }

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (usuario) {
      // ✅ Usuario registrado: mostrar dropdown con nombre
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

      // 🟤 Mostrar/ocultar menú al hacer clic en el nombre
      toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.classList.toggle("show");
      });

      // 🔴 Cerrar sesión
      btnCerrar.addEventListener("click", () => {
        localStorage.removeItem("usuario");
        location.reload();
      });

      // ⚪ Cerrar menú si se hace clic fuera del header
      document.addEventListener("click", (e) => {
        if (!header.contains(e.target)) {
          menu.classList.remove("show");
        }
      });
    } else {
      // 🚪 Usuario no registrado: mostrar botones de login y registro
      // Detecta si estás en index (raíz) o dentro de /assets/page/
      const basePath = window.location.pathname.includes("/assets/page/") ? "./" : "assets/page/";
      header.innerHTML = `
        <button class="btn-login" onclick="window.location.href='${basePath}inicio_sesion.html'">Iniciar Sesión</button>
        <button class="btn-signup" onclick="window.location.href='${basePath}registro_usuario.html'">Crear Cuenta</button>
      `;
    }
  }, 350); // ← ajusta este valor si aún se renderiza después del bundle (500 ms máximo)
});
