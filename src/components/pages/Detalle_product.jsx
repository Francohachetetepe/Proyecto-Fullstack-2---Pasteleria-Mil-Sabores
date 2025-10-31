import React, { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const Detalle_product = () => {
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);

  // ✅ Obtener ID del producto desde la URL (sin useSearchParams)
  const queryParams = new URLSearchParams(window.location.search);
  const idProducto = queryParams.get("id");

  // ==========================
  // 🔍 Cargar producto por ID
  // ==========================
  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        if (!idProducto) return;
        const productoRef = doc(db, "producto", idProducto);
        const docSnap = await getDoc(productoRef);

        if (docSnap.exists()) {
          setProducto({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("Producto no encontrado");
        }
      } catch (error) {
        console.error("Error al obtener producto:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerProducto();
  }, [idProducto]);

  // ==========================
  // 🔧 Actualizar stock en Firebase
  // ==========================
  const actualizarStockFirebase = async (productId, cantidad) => {
    try {
      const productoRef = doc(db, "producto", productId);
      const productoSnap = await getDoc(productoRef);

      if (productoSnap.exists()) {
        const stockActual = productoSnap.data().stock;
        const nuevoStock = Math.max(stockActual - cantidad, 0);
        await updateDoc(productoRef, { stock: nuevoStock });
        console.log(`Stock actualizado: ${nuevoStock}`);
      }
    } catch (error) {
      console.error("Error actualizando stock:", error);
    }
  };

  // ==========================
  // 🛒 Agregar producto al carrito
  // ==========================
  const agregarAlCarrito = (producto) => {
    if (!producto) return;

    const stockActual = producto.stock !== undefined ? producto.stock : 100;
    if (stockActual <= 0) {
      mostrarNotificacion("Producto sin stock disponible", "error");
      return;
    }

    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
    const existente = carritoActual.find((p) => p.id === producto.id);
    let nuevoCarrito;

    if (existente) {
      if ((existente.cantidad || 1) >= producto.stock) {
        mostrarNotificacion("No hay más unidades disponibles", "error");
        return;
      }
      nuevoCarrito = carritoActual.map((p) =>
        p.id === producto.id
          ? { ...p, cantidad: (p.cantidad || 1) + 1 }
          : p
      );
    } else {
      nuevoCarrito = [...carritoActual, { ...producto, cantidad: 1 }];
    }

    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    mostrarNotificacion(`"${producto.nombre}" agregado al carrito`);
    actualizarStockFirebase(producto.id, 1);
  };

  // ==========================
  // 💬 Mostrar notificación
  // ==========================
  const mostrarNotificacion = (mensaje, tipo = "success") => {
    const notif = document.createElement("div");
    notif.textContent = mensaje;
    notif.style.position = "fixed";
    notif.style.bottom = "20px";
    notif.style.right = "20px";
    notif.style.background = tipo === "success" ? "#4caf50" : "#e53935";
    notif.style.color = "white";
    notif.style.padding = "12px 20px";
    notif.style.borderRadius = "5px";
    notif.style.boxShadow = "0 3px 8px rgba(0,0,0,0.3)";
    notif.style.zIndex = "1000";
    notif.style.fontWeight = "600";
    notif.style.transition = "opacity 0.4s ease";
    notif.style.opacity = "1";

    document.body.appendChild(notif);
    setTimeout(() => {
      notif.style.opacity = "0";
      setTimeout(() => notif.remove(), 400);
    }, 2500);
  };

  // ==========================
  // ⏳ Vista de carga
  // ==========================
  if (cargando) {
    return <p className="text-center mt-5">Cargando detalles del producto...</p>;
  }

  if (!producto) {
    return <p className="text-center mt-5 text-danger">Producto no encontrado.</p>;
  }

  // ==========================
  // 🧁 Render principal
  // ==========================
  return (
    <div className="container my-5 p-4 producto-detalle">
      <div className="row justify-content-center align-items-center g-4">
        {/* Imagen */}
        <div className="col-12 col-md-5 text-center">
          <img
            className="img-producto-detalle"
            src={
              producto.image ||
              producto.imagen ||
              "https://via.placeholder.com/300x300?text=Sin+imagen"
            }
            alt={producto.nombre}
            style={{ width: "100%", borderRadius: "10px" }}
          />
        </div>

        {/* Info */}
        <div className="col-12 col-md-6">
          <p className="text-muted mb-2">{producto.categoria}</p>
          <h2 className="mb-3">{producto.nombre}</h2>
          <p className="precio fw-bold mb-3">
            ${producto.precio?.toLocaleString("es-CL")}
          </p>
          <p className="mb-4">{producto.descripcion}</p>
          <p><strong>Stock disponible:</strong> {producto.stock}</p>

          {/* Botones */}
          <div className="d-flex gap-3 mt-4">
            <button
              className="boton btn-volver"
              onClick={() => (window.location.href = "../page/catalogo.html")}
            >
              ← Volver al catálogo
            </button>
            <button
              className="boton btn-agregar"
              onClick={() => agregarAlCarrito(producto)}
            >
              🛒 Agregar al carrito
            </button>
          </div>

          {/* Compartir */}
          <div className="mt-5 compartir">
            <p>¡Comparte este producto!</p>
            <button className="btn-facebook">Facebook</button>
            <button className="btn-twitter">Twitter</button>
            <button className="btn-whatsapp">WhatsApp</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detalle_product;
