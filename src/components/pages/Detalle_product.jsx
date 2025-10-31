import React, { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";

const Detalle_product = () => {
  const [producto, setProducto] = useState(null);
  const [relacionados, setRelacionados] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return;

    const cargarProducto = async () => {
      try {
        const docRef = doc(db, "producto", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };
          setProducto(data);
          await cargarRelacionados(data.categoria, id);
        }
      } catch (error) {
        console.error("Error al cargar producto:", error);
      }
    };

    const cargarRelacionados = async (categoria, idActual) => {
      try {
        const q = query(collection(db, "producto"), where("categoria", "==", categoria));
        const snapshot = await getDocs(q);
        const lista = snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((p) => p.id !== idActual)
          .slice(0, 4);
        setRelacionados(lista);
      } catch (error) {
        console.error("Error al cargar relacionados:", error);
      }
    };

    cargarProducto();
  }, []);

  useEffect(() => {
    if (!producto) return;

    // Cargar datos en el HTML
    document.getElementById("imgProducto").src = producto.image;
    document.getElementById("nombreProducto").textContent = producto.nombre;
    document.getElementById("categoriaProducto").textContent = producto.categoria;
    document.getElementById("precioProducto").textContent = `$${(
      producto.precio_oferta || producto.precio
    ).toLocaleString("es-CL")}`;
    document.getElementById("descripcionProducto").textContent = producto.descripcion;

    // Evento para agregar al carrito
    const btnAgregar = document.getElementById("btnAgregarCarrito");
    if (btnAgregar) {
      btnAgregar.onclick = () => {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const existente = carrito.find((p) => p.id === producto.id);
        if (existente) existente.cantidad += 1;
        else carrito.push({ ...producto, cantidad: 1 });
        localStorage.setItem("carrito", JSON.stringify(carrito));
        alert(`"${producto.nombre}" agregado al carrito 🛒`);
      };
    }
  }, [producto]);

  // Cargar relacionados
  useEffect(() => {
    const cont = document.getElementById("relacionados");
    if (!cont) return;
    cont.innerHTML = "";

    relacionados.forEach((r) => {
      const card = document.createElement("div");
      card.className = "col-6 col-md-3 text-center";
      card.innerHTML = `
        <div class="card h-100 shadow-sm" style="cursor:pointer;">
          <img src="${r.image}" class="card-img-top" style="height:180px; object-fit:cover;">
          <div class="card-body">
            <h6>${r.nombre}</h6>
            <p class="fw-bold text-primary">$${(r.precio_oferta || r.precio).toLocaleString("es-CL")}</p>
          </div>
        </div>
      `;
      card.onclick = () => (window.location.href = `detalle_product.html?id=${r.id}`);
      cont.appendChild(card);
    });
  }, [relacionados]);

  return null;
};

export default Detalle_product;
