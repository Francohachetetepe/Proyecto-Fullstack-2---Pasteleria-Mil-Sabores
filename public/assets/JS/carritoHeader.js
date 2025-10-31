// === carritoHeader.js ===
// Actualiza el total del carrito en el header en tiempo real

if (!window.__carritoHeaderInicializado) {
  window.__carritoHeaderInicializado = true;

  console.log("🟢 carritoHeader.js activo");

  function actualizarCarritoHeader() {
    try {
      const spanTotal = document.querySelector(".carrito-total");
      if (!spanTotal) return;

      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      const total = carrito.reduce(
        (sum, p) => sum + ((p.precio || p.precio_unitario || 0) * (p.cantidad || 1)),
        0
      );

      spanTotal.textContent = total.toLocaleString("es-CL");
      console.log("🛒 Total actualizado:", total);
    } catch (error) {
      console.error("Error al actualizar total del carrito:", error);
    }
  }

  // 🚀 Actualiza al cargar la página
  document.addEventListener("DOMContentLoaded", actualizarCarritoHeader);

  // 🔁 Escucha actualizaciones del carrito (React o Vanilla)
  window.addEventListener("carritoActualizado", () => {
    console.log("📢 Evento carritoActualizado recibido");
    actualizarCarritoHeader();
  });

  // 🛒 Botón del carrito (redirige correctamente)
  document.addEventListener("DOMContentLoaded", () => {
    const btnCarrito = document.querySelector(".btn-carrito");
    if (btnCarrito) {
      btnCarrito.addEventListener("click", () => {
        const url = window.location.pathname.includes("/assets/page/")
          ? "carrito.html"
          : "assets/page/carrito.html";
        window.location.href = url;
      });
    }
  });
}
