// Inicializar página de error cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    inicializarPaginaError();
    configurarEventosError();
    actualizarCarritoHeader(); // Mantener carrito en error
});

/**
 * Inicializa la página de error con los datos de la compra fallida
 */
function inicializarPaginaError() {
    const urlParams = new URLSearchParams(window.location.search);
    const ordenParam = urlParams.get('orden');
    const ultimaCompra = JSON.parse(localStorage.getItem('ultimaCompra'));
    
    if (!ultimaCompra && !ordenParam) {
        // Redirigir al carrito si no hay datos de compra
        window.location.href = 'carrito.html';
        return;
    }

    // Mostrar datos de la compra fallida
    mostrarDatosCompraError(ultimaCompra);
    renderizarProductosError(ultimaCompra.productos);
    actualizarTotalError(ultimaCompra.total);
}

/**
 * Muestra los datos de la compra fallida en los formularios
 */
function mostrarDatosCompraError(compra) {
  // Número de orden
  const numeroErrorEl = document.getElementById('numeroError');
  if (numeroErrorEl) numeroErrorEl.textContent = compra.numeroOrden || '#000000';

  // Datos del cliente
  document.getElementById('errorNombre').value = compra?.cliente?.nombre || '';
  document.getElementById('errorApellidos').value = compra?.cliente?.apellidos || '';
  document.getElementById('errorCorreo').value = compra?.cliente?.correo || '';

  // Dirección
  document.getElementById('errorCalle').value = compra?.direccion?.calle || '';
  document.getElementById('errorDepartamento').value = compra?.direccion?.departamento || '';
  document.getElementById('errorRegion').value = compra?.direccion?.region || '';
  document.getElementById('errorComuna').value = compra?.direccion?.comuna || '';
  document.getElementById('errorIndicaciones').value = compra?.direccion?.indicaciones || '';
}

/**
 * Renderiza los productos en la tabla de error
 */
function renderizarProductosError(productos) {
  const tbody = document.getElementById('tablaErrorBody');

  if (!productos || productos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="carrito-vacio">
          <div class="icono">🛒</div>
          <h3>No hay productos registrados en la orden</h3>
          <a href="carrito.html" class="btn-ir-catalogo">Volver al carrito</a>
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = productos
    .map(
      (producto) => `
      <tr>
        <td>
          <img src="${producto.image || 'https://via.placeholder.com/100x100/cccccc/969696?text=Imagen'}" 
               alt="${producto.nombre}" 
               class="imagen-tabla">
        </td>
        <td>${producto.nombre}</td>
        <td>$${(producto.precio || 0).toLocaleString('es-CL')}</td>
        <td>${producto.cantidad || 1}</td>
        <td>$${((producto.precio || 0) * (producto.cantidad || 1)).toLocaleString('es-CL')}</td>
      </tr>`
    )
    .join('');
}

/**
 * Actualiza el total en la página de error
 */
function actualizarTotalError(total) {
  const totalElement = document.getElementById('totalError');
  if (totalElement)
    totalElement.textContent = total.toLocaleString('es-CL');
}

/**
 * Actualiza el header del carrito (mantener productos en error)
 */
function actualizarCarritoHeader() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const total = carrito.reduce(
    (sum, p) => sum + (p.precio || 0) * (p.cantidad || 1),
    0
  );

  const totalHeaderEl = document.querySelector('.carrito-total');
  if (totalHeaderEl)
    totalHeaderEl.textContent = total.toLocaleString('es-CL');
}

/**
 * Redirige al checkout para reintentar el pago
 */
function reintentarPago() {
    window.location.href = 'checkout.html';
}

/**
 * Configura los eventos de la página de error
 */
function configurarEventosError() {
  const btnReintentar = document.getElementById('btnReintentarPago');
  if (btnReintentar)
    btnReintentar.addEventListener('click', reintentarPago);
}