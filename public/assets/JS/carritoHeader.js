// 🔸 Sincroniza el total del carrito en todas las páginas
document.addEventListener('DOMContentLoaded', () => {
  try {
    const spanTotal = document.querySelector('.carrito-total');
    if (!spanTotal) return; // Si la página no tiene carrito en el header, no hace nada

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Calcular total acumulado
    const total = carrito.reduce((sum, producto) => {
      return sum + ((producto.precio || 0) * (producto.cantidad || 1));
    }, 0);

    // Mostrar total en formato CLP
    spanTotal.textContent = total.toLocaleString('es-CL');
  } catch (error) {
    console.error("Error al actualizar el total del carrito:", error);
  }
});