import React, { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";

const Ofertas = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerOfertas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "producto"));
        const lista = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.precio_oferta && data.precio_oferta < data.precio) {
            lista.push({ id: doc.id, ...data });
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

  /** ==============================
   * 🛒 Agregar producto al carrito
   * ============================== */
  const agregarAlCarrito = (producto) => {
    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];

    const existente = carritoActual.find((p) => p.id === producto.id);

    let nuevoCarrito;
    if (existente) {
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
  };

  const mostrarNotificacion = (mensaje) => {
    const notif = document.createElement("div");
    notif.textContent = mensaje;
    notif.style.position = "fixed";
    notif.style.bottom = "20px";
    notif.style.right = "20px";
    notif.style.background = "#4caf50";
    notif.style.color = "white";
    notif.style.padding = "10px 20px";
    notif.style.borderRadius = "5px";
    notif.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
    notif.style.zIndex = "1000";
    document.body.appendChild(notif);

    setTimeout(() => notif.remove(), 2500);
  };

  // ===============================

  if (cargando) {
    return (
      <div className="cargando">
        <p>🔄 Cargando productos en oferta...</p>
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="sin-ofertas">
        <h3>😕 No hay productos en oferta por el momento.</h3>
      </div>
    );
  }

  return (
    <div className="productos-grid">
      {productos.map((p) => {
        const descuento =
          p.precio && p.precio_oferta
            ? Math.round(100 - ((p.precio_oferta * 100) / p.precio))
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
              className="producto-imagen"
            />
            <div className="producto-info">
              <h3 className="producto-nombre">{p.nombre|| 'Sin nombre'}</h3>
                <div className="precio-superior">
                  <p className="producto-anterior">
                     ${p.precio.toLocaleString("es-CL")}
                  </p>
                  <p className="porcentaje-descuento">🔻 {descuento}% OFF</p>
                </div>
                
                <div className="precios-oferta">
                  <span className="producto-precio">
                     ${p.precio_oferta.toLocaleString("es-CL")}
                  </span>
                </div>
                <p className="producto-stock">Stock: ${p.stock}</p>
                
              <button className="btn-agregar" data-id="{p.id}">
                🛒 Agregar al carrito
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Ofertas;
