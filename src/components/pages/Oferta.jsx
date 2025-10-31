import React, { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";

const Ofertas = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // ===============================
  // 🔍 Obtener productos en oferta
  // ===============================
  useEffect(() => {
    const obtenerOfertas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "producto"));
        const lista = [];

        querySnapshot.forEach((docu) => {
          const data = docu.data();
          if (data.precio_oferta && data.precio_oferta < data.precio) {
            lista.push({ id: docu.id, ...data });
          }
        });

        setProductos(lista);
      } catch (error) {
        console.error("Error al cargar ofertas:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerOfertas();
  }, []);

  // ===============================
  // 🔧 Actualizar stock en Firebase
  // ===============================
  const actualizarStockFirebase = async (productId, cantidad) => {
    try {
      const productoRef = doc(db, "producto", productId);
      const productoSnap = await getDoc(productoRef);

      if (productoSnap.exists()) {
        const stockActual = productoSnap.data().stock;
        const nuevoStock = Math.max(stockActual - cantidad, 0);
        await updateDoc(productoRef, { stock: nuevoStock });
        return nuevoStock;
      }
    } catch (error) {
      console.error("Error actualizando stock:", error);
    }
    return null;
  };

  // ===============================
  // 🛒 Agregar producto al carrito
  // ===============================
  const agregarAlCarrito = async (producto) => {
    if (!producto) return;

    try {
      // 🟢 Obtener stock actualizado desde Firestore
      const productoRef = doc(db, "producto", producto.id);
      const snap = await getDoc(productoRef);
      if (!snap.exists()) {
        mostrarNotificacion("Producto no encontrado", "error");
        return;
      }

      const data = snap.data();
      const stockDisponible = data.stock ?? 0;
      if (stockDisponible <= 0) {
        mostrarNotificacion("Producto sin stock disponible", "error");
        return;
      }

      // 🏷️ Determinar precio correcto (oferta o normal)
      const precioNormal = Number(data.precio) || 0;
      const precioOferta = Number(data.precio_oferta) || 0;
      const precioFinal = precioOferta > 0 && precioOferta < precioNormal ? precioOferta : precioNormal;

      // 🧾 Obtener carrito actual
      const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
      const existente = carritoActual.find((p) => p.id === producto.id);
      let nuevoCarrito;

      if (existente) {
        const disponibleTotal = stockDisponible + (existente.cantidad || 0);
        if (existente.cantidad >= disponibleTotal) {
          mostrarNotificacion("No hay más unidades disponibles", "error");
          return;
        }
        nuevoCarrito = carritoActual.map((p) =>
          p.id === producto.id
            ? { ...p, cantidad: (p.cantidad || 1) + 1 }
            : p
        );
      } else {
        nuevoCarrito = [
          ...carritoActual,
          {
            ...producto,
            precio: precioFinal,
            cantidad: 1,
            stock: stockDisponible,
          },
        ];
      }

      // 💾 Guardar carrito
      localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));

      // 🔄 Actualizar header
      window.dispatchEvent(new Event("carritoActualizado"));

      // 🟠 Descontar stock en Firebase
      const nuevoStock = await actualizarStockFirebase(producto.id, 1);

      // 🔵 Actualizar stock visual
      if (nuevoStock !== null) {
        setProductos((prev) =>
          prev.map((p) =>
            p.id === producto.id ? { ...p, stock: nuevoStock } : p
          )
        );
      }

      mostrarNotificacion(`"${producto.nombre}" agregado al carrito`);
    } catch (error) {
      console.error("Error al agregar producto:", error);
      mostrarNotificacion("Ocurrió un error al agregar el producto", "error");
    }
  };

  // ===============================
  // 💬 Notificación visual
  // ===============================
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

  // ===============================
  // 🕓 Render
  // ===============================
  if (cargando) {
    return <p style={{ textAlign: "center" }}>Cargando productos...</p>;
  }

  if (productos.length === 0) {
    return <p style={{ textAlign: "center" }}>No hay productos en oferta.</p>;
  }

  return (
    <div className="productos-grid">
      {productos.map((p) => {
        const descuento =
          p.precio && p.precio_oferta
            ? Math.round(100 - (p.precio_oferta * 100) / p.precio)
            : 0;

        return (
          <div key={p.id} className="producto-card">
            <img
              src={
                p.image ||
                p.imagen ||
                "https://via.placeholder.com/200x150?text=Sin+imagen"
              }
              alt={p.nombre}
              onClick={() =>
                (window.location.href = `../page/detalle_product.html?id=${p.id}`)
              }
              className="producto-imagen"
            />

            <div className="producto-info">
              <h3 className="producto-nombre">{p.nombre}</h3>

              <div className="precio-superior">
                <p className="producto-anterior">
                  ${p.precio?.toLocaleString("es-CL")}
                </p>
                <p className="porcentaje-descuento">🔻 {descuento}% OFF</p>
              </div>

              <div className="precios-oferta">
                <span className="producto-precio">
                  ${p.precio_oferta?.toLocaleString("es-CL")}
                </span>
              </div>

              <p className="producto-stock">Stock: {p.stock}</p>

              <button
                className="btn-agregar"
                onClick={() => agregarAlCarrito(p)}
                disabled={p.stock <= 0}
              >
                {p.stock > 0 ? "🛒 Agregar al carrito" : "Sin stock"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Ofertas;
