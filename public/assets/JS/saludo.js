document.addEventListener("DOMContentLoaded", () => {
    // 🔹 Obtener usuario de localStorage
    const usuarioStr = localStorage.getItem("usuario");
    if (!usuarioStr) return;
    const usuario = JSON.parse(usuarioStr);

    // 🔹 Mostrar nombre en home y sidebar
    const bienvenido = document.getElementById("bienvenido");
    const sidebarName = document.getElementById("sidebarUserName");
    if (bienvenido) bienvenido.innerText = `Bienvenido ${usuario.nombre}!`;
    if (sidebarName) sidebarName.textContent = usuario.nombre;

    // 🔹 Mostrar solo home al inicio
    document.querySelectorAll('.seccion').forEach(sec => sec.style.display = 'none');
    const home = document.getElementById('home');
    if (home) home.style.display = 'block';

    // 🔹 Toggle sidebar
    const toggleBtn = document.getElementById("toggleSidebar");
    const sidebar = document.getElementById("sidebar");
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener("click", () => {
            sidebar.classList.toggle("expanded"); // Asegúrate que tu CSS tenga .sidebar.open
        });
    }

    // 🔹 Navegación entre secciones
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                // Ocultar todas las secciones
                document.querySelectorAll('.seccion').forEach(sec => sec.style.display = 'none');
                // Mostrar la sección objetivo
                const seccionId = href.substring(1);
                const target = document.getElementById(seccionId);
                if (target) target.style.display = 'block';
            }
        });
    });

    // 🔹 Cerrar sesión
    const btnCerrar = document.getElementById("cerrarSesion");
    if (btnCerrar) {
        btnCerrar.addEventListener("click", () => {
            localStorage.removeItem("usuario");
            window.location.href = "../../index.html";
        });
    }
});
