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
    contenedor.innerHTML = productos.map(producto => `
        <div class="producto-card">
            <img src="${producto.image}" 
                 alt="${producto.nombre}" 
                 class="producto-imagen"
                 onerror="this.src='https://via.placeholder.com/400x300/cccccc/969696?text=Imagen+No+Disponible'">
            <div class="producto-info">
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <div class="precios-oferta">
                    <span class="precio-anterior">$${producto.precioAnterior?.toLocaleString('es-CL')}</span>
                    <span class="precio-actual">$${producto.precio?.toLocaleString('es-CL')}</span>
                </div>
                <p class="stock-disponible">Stock: ${producto.stock || 10}</p>
                <button class="btn-agregar-oferta" data-id="${producto.id}">
                    Añadir
                </button>
            </div>
        </div>
    `).join('');

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
    
    if (producto) {
        // Verificar stock antes de agregar
        if (producto.stock <= 0) {
            mostrarNotificacion('Producto sin stock disponible', 'error');
            return;
        }
        
        // Verificar si el producto ya está en el carrito
        const productoExistente = carrito.find(item => item.id === productId);
        
        if (productoExistente) {
            productoExistente.cantidad = (productoExistente.cantidad || 1) + 1;
        } else {
            carrito.push({
                ...producto,
                cantidad: 1
            });
        }
        
        guardarCarrito();
        renderizarCarrito();
        calcularTotal();
        
        // ACTUALIZAR STOCK EN FIREBASE - AGREGAR ESTA LÍNEA
        actualizarStockFirebase(productId, 1);
        
        mostrarNotificacion(`"${producto.nombre}" agregado al carrito`);
    }
}

/**
 * Actualizar stock en Firebase cuando se agrega al carrito
 */
async function actualizarStockFirebase(productId, cantidad) {
    try {
        const productoRef = db.collection("producto").doc(productId);
        const productoDoc = await productoRef.get();
        
        if (productoDoc.exists) {
            const stockActual = productoDoc.data().stock;
            const nuevoStock = stockActual - cantidad;
            
            await productoRef.update({
                stock: nuevoStock
            });
            
            console.log(`Stock actualizado: ${productoDoc.data().nombre} - Nuevo stock: ${nuevoStock}`);
        }
    } catch (error) {
        console.error("Error actualizando stock en Firebase:", error);
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
            const stockActual = productoDoc.data().stock;
            const nuevoStock = stockActual + cantidad;
            
            await productoRef.update({
                stock: nuevoStock
            });
            
            console.log(`Stock restaurado: ${productoDoc.data().nombre} - Nuevo stock: ${nuevoStock}`);
        }
    } catch (error) {
        console.error("Error restaurando stock en Firebase:", error);
    }
}


/**
 * Aumenta la cantidad de un producto en el carrito
 */
function aumentarCantidad(index) {
    const producto = carrito[index];
    
    // Verificar stock antes de aumentar
    if (producto.stock <= producto.cantidad) {
        mostrarNotificacion('No hay suficiente stock disponible', 'error');
        return;
    }
    
    carrito[index].cantidad = (carrito[index].cantidad || 1) + 1;
    guardarCarrito();
    renderizarCarrito();
    calcularTotal();
    
    // Actualizar stock en Firebase
    actualizarStockFirebase(producto.id, 1);
}


/**
 * Disminuye la cantidad de un producto en el carrito
 */
function disminuirCantidad(index) {
    const producto = carrito[index];
    
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--;
        guardarCarrito();
        renderizarCarrito();
        calcularTotal();
        
        // Restaurar stock en Firebase
        restaurarStockFirebase(producto.id, 1);
    }
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
function limpiarCarrito() {
    if (carrito.length === 0) {
        alert('El carrito ya está vacío');
        return;
    }
    
    if (confirm('¿Estás seguro de que quieres limpiar todo el carrito?')) {
        carrito = [];
        guardarCarrito();
        renderizarCarrito();
        calcularTotal();
        mostrarNotificacion('Carrito limpiado correctamente');
    }
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