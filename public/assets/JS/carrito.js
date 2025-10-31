// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAzRg6nsE4TZgdvMeeU7Nvjo64k7m8HrrE",
    authDomain: "tiendapasteleriamilsabor-de980.firebaseapp.com",
    projectId: "tiendapasteleriamilsabor-de980",
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Variables globales
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let productosOferta = [];

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    inicializarCarrito();
    cargarProductosOferta();
    configurarEventos();
});

//aplicar descuento
async function aplicarDescuento(total) {
  const usuarioStr = localStorage.getItem("usuario");
  if (!usuarioStr) return { totalFinal: total, descuento: 0 };

  const usuario = JSON.parse(usuarioStr);

  try {
    const query = await db.collection("usuario")
      .where("correo", "==", usuario.correo)
      .get();

    if (!query.empty) {
      const data = query.docs[0].data();
      let descuento = data.descuento || 0; // número (%)
      const codigoPromo = data.codigoPromo || null;
      const fechaNacimiento = data.fechaNacimiento; // "yyyy-mm-dd"

      // Verificar si hoy es su cumpleaños
      let esCumpleHoy = false;
      if (fechaNacimiento && usuario.rol === "cliente") {
        const [anio, mes, dia] = fechaNacimiento.split("-").map(Number);
        const hoy = new Date();
        esCumpleHoy = dia === hoy.getDate() && (mes - 1) === hoy.getMonth();
      }

      // Aplicar descuento de cumpleaños SOLO si es hoy y es alumno Duoc
      if (esCumpleHoy && usuario.correo.toLowerCase().endsWith("@duoc.cl")) {
        descuento = 100;
      }

      let totalConDescuento = total;
      if (descuento > 0) {
        console.log(`${esCumpleHoy ? "Descuento de cumpleaños" : codigoPromo ? "Código " + codigoPromo : "Descuento automático"}: ${descuento}%`);
        totalConDescuento = total - (total * descuento / 100);
      }

      return { totalFinal: totalConDescuento, descuento };
    }

    return { totalFinal: total, descuento: 0 };
  } catch (error) {
    console.error("Error al obtener el descuento:", error);
    return { totalFinal: total, descuento: 0 };
  }
}


/**
 * Inicializa la interfaz del carrito
 */
function inicializarCarrito() {
    actualizarCarritoHeader();
    renderizarCarrito();
    calcularTotal();
}

/**
 * Carga productos en oferta desde Firestore
 */
async function cargarProductosOferta() {
  try {
    // 🔹 Trae todos los productos con precio_oferta menor al precio normal
    const snapshot = await db.collection("producto").get();
    const productos = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(p => p.precio_oferta && p.precio_oferta < p.precio);

    productosOferta = productos;
    renderizarProductosOferta(productos);
  } catch (error) {
    console.error("Error cargando productos en oferta:", error);
    const contenedor = document.getElementById("productosOferta");
    if (contenedor) contenedor.innerHTML = `<p>Error al cargar las ofertas.</p>`;
  }
}

/**
 * Renderiza los productos en oferta
 */
function renderizarProductosOferta(productos) {
  const contenedor = document.getElementById('productosOferta');
  if (!contenedor) return;

  if (productos.length === 0) {
    contenedor.innerHTML = '<p>No hay productos en oferta en este momento.</p>';
    return;
  }

  contenedor.innerHTML = productos.map(producto => {
    const precioNormal = Number(producto.precio) || 0;
    const precioOferta = Number(producto.precio_oferta) || 0;
    const descuento = precioNormal > 0 
      ? Math.round(((precioNormal - precioOferta) / precioNormal) * 100)
      : 0;

    return `
      <div class="producto-card">
        <img src="${producto.image || '../img/sin-imagen.png'}" 
             alt="${producto.nombre}" 
             class="producto-imagen"
             onerror="this.src='https://via.placeholder.com/400x300/cccccc/969696?text=Imagen+No+Disponible'">

        <div class="producto-info">
          <h3 class="producto-nombre">${producto.nombre}</h3>

          <div class="precio-superior">
            <span class="producto-anterior">$${precioNormal.toLocaleString('es-CL')}</span>
            <span class="producto-precio">$${precioOferta.toLocaleString('es-CL')}</span>
            ${descuento > 0 ? `<span class="porcentaje-descuento">-${descuento}%</span>` : ''}
          </div>

          <p class="stock-disponible">Stock: ${producto.stock ?? '—'}</p>

          <button class="btn-agregar-oferta" data-id="${producto.id}">
            Añadir
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Eventos para agregar productos
  document.querySelectorAll('.btn-agregar-oferta').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      agregarProductoAlCarrito(id);
    });
  });
}

/**
 * Renderiza los productos en el carrito
 */
function renderizarCarrito() {
    const tbody = document.getElementById('tablaCarritoBody');
    
    if (carrito.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="carrito-vacio">
                    <div class="icono">🛒</div>
                    <h3>Tu carrito está vacío</h3>
                    <p>Agrega algunos productos para continuar</p>
                    <a href="catalogo.html" class="btn-ir-catalogo">Ir al Catálogo</a>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = carrito.map((producto, index) => `
        <tr>
            <td>
                <img src="${producto.image}" 
                alt="${producto.nombre}" 
                class="imagen-tabla"
                onerror="this.src='https://via.placeholder.com/100x100/cccccc/969696?text=Imagen'">
            </td>
            <td>${producto.nombre}</td>
            <td>$${producto.precio?.toLocaleString('es-CL')}</td>
            <td>
                <div class="controles-cantidad">
                    <button class="btn-cantidad" onclick="disminuirCantidad(${index})">-</button>
                    <span class="cantidad-actual">${producto.cantidad || 1}</span>
                    <button class="btn-cantidad" onclick="aumentarCantidad(${index})">+</button>
                </div>
            </td>
            <td>$${((producto.precio || 0) * (producto.cantidad || 1)).toLocaleString('es-CL')}</td>
            <td>
                <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})">
                    Eliminar
                </button>
            </td>
        </tr>
    `).join('');
}

/**
 * Agrega un producto al carrito
 */
function agregarProductoAlCarrito(productId) {
  const producto = productosOferta.find(p => p.id === productId);
  if (!producto) return;

  // Verificar stock antes de agregar
  if (producto.stock <= 0) {
    mostrarNotificacion('Producto sin stock disponible', 'error');
    return;
  }

  // Determinar precio final (oferta o normal)
  const precioFinal =
    producto.precio_oferta && producto.precio_oferta < producto.precio
      ? producto.precio_oferta
      : producto.precio;

  // Buscar producto en carrito
  const productoExistente = carrito.find(item => item.id === productId);

  if (productoExistente) {
    const stockRestante = (producto.stock_original ?? producto.stock) - productoExistente.cantidad;
    if (stockRestante <= 0) {
      mostrarNotificacion('No hay suficiente stock disponible', 'error');
      return;
    }
    productoExistente.cantidad++;
  } else {
    // Guardar stock original antes de empezar a descontar
    producto.stock_original = producto.stock;
    carrito.push({
      ...producto,
      precio: precioFinal,
      cantidad: 1
    });
  }

  // 🔄 Actualizar Firebase y stock local
  actualizarStockFirebase(producto.id, 1).then(nuevoStock => {
    if (nuevoStock !== null) {
      producto.stock = nuevoStock;
      if (producto.stock_original === undefined) producto.stock_original = nuevoStock;
      renderizarProductosOferta(productosOferta);
    }
  });

  // 💾 Guardar cambios
  guardarCarrito();
  renderizarCarrito();
  calcularTotal();
  actualizarCarritoHeader();

  // 🔔 Notificación
  mostrarNotificacion(`"${producto.nombre}" agregado al carrito`);
}

/**
 * Actualizar stock en Firebase cuando se agrega al carrito
 */
async function actualizarStockFirebase(productId, cantidad) {
  try {
    const productoRef = db.collection("producto").doc(productId);
    const productoDoc = await productoRef.get();

    if (!productoDoc.exists) return null;

    const data = productoDoc.data();
    const stockActual = Number(data.stock) || 0;
    const nuevoStock = stockActual - cantidad;

    // 🔹 Asegurar que el stock nunca sea negativo
    const stockFinal = nuevoStock < 0 ? 0 : nuevoStock;

    await productoRef.update({ stock: stockFinal });
    console.log(`✅ Stock actualizado en Firebase: ${data.nombre} (${stockActual} → ${stockFinal})`);

    return stockFinal; // devolver nuevo valor real
  } catch (error) {
    console.error("Error actualizando stock en Firebase:", error);
    return null;
  }
}

/**
 * Restaurar stock cuando se elimina del carrito
 */
async function restaurarStockFirebase(productId, cantidad) {
  try {
    const productoRef = db.collection("producto").doc(productId);
    const productoDoc = await productoRef.get();
    
    if (productoDoc.exists) {
      const stockActual = productoDoc.data().stock || 0;
      const nuevoStock = stockActual + cantidad;
      
      await productoRef.update({
        stock: nuevoStock
      });
      
      console.log(`Stock restaurado: ${productoDoc.data().nombre} - Nuevo stock: ${nuevoStock}`);
      return nuevoStock; // 👈 importante
    }
  } catch (error) {
    console.error("Error restaurando stock en Firebase:", error);
  }
  return null;
}


/**
 * Aumenta la cantidad de un producto en el carrito
 */
async function aumentarCantidad(index) {
  const producto = carrito[index];
  
  // Verificar stock antes de aumentar
  if (producto.stock <= producto.cantidad) {
    mostrarNotificacion('No hay suficiente stock disponible', 'error');
    return;
  }

  carrito[index].cantidad++;
  guardarCarrito();
  renderizarCarrito();
  calcularTotal();

  // 🔹 Actualizar stock en Firebase
  const nuevoStock = await actualizarStockFirebase(producto.id, 1);
  
  // 🔹 Actualizar stock también en memoria local (productosOferta)
  const productoOferta = productosOferta.find(p => p.id === producto.id);
  if (productoOferta && nuevoStock !== null) {
    productoOferta.stock = nuevoStock;
  }

  // 🔹 Re-renderizar ofertas para reflejar el nuevo stock
  renderizarProductosOferta(productosOferta);
}


/**
 * Disminuye la cantidad de un producto en el carrito
 */
async function disminuirCantidad(index) {
  const producto = carrito[index];
  if (!producto) return;

  if (producto.cantidad > 1) {
    // 🔹 Disminuir una unidad
    producto.cantidad--;
    guardarCarrito();
    renderizarCarrito();
    calcularTotal();

    // 🔹 Restaurar solo 1 unidad en Firebase
    const nuevoStock = await restaurarStockFirebase(producto.id, 1);
    const productoOferta = productosOferta.find(p => p.id === producto.id);
    if (productoOferta && nuevoStock !== null) {
      productoOferta.stock = nuevoStock;
    }
    renderizarProductosOferta(productosOferta);
  } else {
    // ⚠️ Si llega a 0 → eliminar del carrito
    const cantidadRestaurar = producto.cantidad || 1;
    carrito.splice(index, 1);
    guardarCarrito();
    renderizarCarrito();
    calcularTotal();

    // 🔹 Restaurar stock completo eliminado
    const nuevoStock = await restaurarStockFirebase(producto.id, cantidadRestaurar);
    const productoOferta = productosOferta.find(p => p.id === producto.id);
    if (productoOferta && nuevoStock !== null) {
      productoOferta.stock = nuevoStock;
    }
    renderizarProductosOferta(productosOferta);

    mostrarNotificacion(`"${producto.nombre}" eliminado del carrito`);
  }

  actualizarCarritoHeader();
}


/**
 * Elimina un producto del carrito
 */
function eliminarDelCarrito(index) {
    const producto = carrito[index];
    const cantidadEliminada = producto.cantidad || 1;
    
    carrito.splice(index, 1);
    guardarCarrito();
    renderizarCarrito();
    calcularTotal();
    mostrarNotificacion(`"${producto.nombre}" eliminado del carrito`);

    // Llamar a esta función para restaurar stock - CORREGIDO
    restaurarStockFirebase(producto.id, cantidadEliminada);
}

// Desc de cumpleaños
function esCumpleDeHoy(usuario) {
  if (!usuario || !usuario.fechaNacimiento) return false;
  const [anio, mes, dia] = usuario.fechaNacimiento.split("-").map(Number);
  const hoy = new Date();
  return dia === hoy.getDate() && (mes - 1) === hoy.getMonth();
}


/**
 * Calcula el total del carrito
 */
async function calcularTotal() {
  const subtotal = carrito.reduce((sum, producto) => {
    return sum + ((producto.precio || 0) * (producto.cantidad || 1));
  }, 0);

  // Mostrar subtotal
  document.getElementById('subtotalCarrito').textContent = subtotal.toLocaleString('es-CL');

  // Aplicar descuento
  const { totalFinal, descuento } = await aplicarDescuento(subtotal);

  // Actualizar DOM
  const totalEl = document.getElementById('totalCarrito');
  const lineaDesc = document.getElementById('lineaDescuento');
  const porcentajeEl = document.getElementById('porcentajeDescuento');

  if (descuento > 0) {
    lineaDesc.style.display = "block";
    porcentajeEl.textContent = descuento;
  } else {
    lineaDesc.style.display = "none";
  }

  totalEl.textContent = totalFinal.toLocaleString('es-CL');
}


/**
 * Actualiza el header del carrito
 */
function actualizarCarritoHeader() {
    const total = carrito.reduce((sum, producto) => {
        return sum + ((producto.precio || 0) * (producto.cantidad || 1));
    }, 0);
    
    document.querySelector('.carrito-total').textContent = total.toLocaleString('es-CL');
}

/**
 * Guarda el carrito en localStorage
 */
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

/**
 * Limpia todo el carrito
 */
async function limpiarCarrito() {
  if (carrito.length === 0) {
    alert('El carrito ya está vacío');
    return;
  }

  if (!confirm('¿Estás seguro de que quieres limpiar todo el carrito?')) {
    return;
  }

  // 1. Recorremos el carrito ANTES de vaciarlo
  for (const item of carrito) {
    const cant = item.cantidad || 1;

    // 🔄 Restaurar en Firestore
    const nuevoStock = await restaurarStockFirebase(item.id, cant);

    // 🔄 Reflejar también en memoria local (productosOferta)
    const productoOferta = productosOferta.find(p => p.id === item.id);
    if (productoOferta && nuevoStock !== null) {
      productoOferta.stock = nuevoStock;
    }
  }

  // 2. Vaciar carrito en memoria y en localStorage
  carrito = [];
  guardarCarrito();

  // 3. Refrescar pantallas
  renderizarCarrito();
  calcularTotal();
  actualizarCarritoHeader();
  renderizarProductosOferta(productosOferta);

  mostrarNotificacion('Carrito limpiado correctamente');
}

/**
 * Redirige al checkout
 */
function irAlCheckout() {
    if (carrito.length === 0) {
        alert('Agrega productos al carrito antes de continuar');
        return;
    }
    
    window.location.href = 'checkout.html';
}

/**
 * Muestra una notificación temporal
 */
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        font-weight: 600;
    `;
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

/**
 * Configura los eventos de la página
 */
function configurarEventos() {
    document.getElementById('btnLimpiarCarrito').addEventListener('click', limpiarCarrito);
    document.getElementById('btnComprarAhora').addEventListener('click', irAlCheckout);
}

// Hacer funciones disponibles globalmente
window.aumentarCantidad = aumentarCantidad;
window.disminuirCantidad = disminuirCantidad;
window.eliminarDelCarrito = eliminarDelCarrito;

console.log("Usuario ingresado:", JSON.parse(localStorage.getItem("usuario")));

// 🔄 Mantener sincronizado el total del header en todas las vistas
document.addEventListener('DOMContentLoaded', actualizarCarritoHeader);