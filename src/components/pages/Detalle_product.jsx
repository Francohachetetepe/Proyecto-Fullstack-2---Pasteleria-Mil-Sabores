import { useEffect, useState } from "react";
import { db } from "../../config/firebase";

const Detalle_producto = () => {
  const [producto, setProducto] = useState(null);
  const [relacionados, setRelacionados] = useState([]);

  useEffect(() => {
    // 1️⃣ Obtener ID del producto desde la URL (?id=xxx)
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) return;

    // 2️⃣ Cargar el producto desde Firestore
    const cargarProducto = async () => {
      try {
        const doc = await db.collection("producto").doc(id).get();
        if (doc.exists) {
          setProducto({ id: doc.id, ...doc.data() });
          cargarRelacionados(doc.data().categoria);
        } else {
          console.error("❌ Producto no encontrado");
        }
      } catch (error) {
        console.error("⚠️ Error cargando producto:", error);
      }
    };

    // 3️⃣ Cargar productos relacionados (misma categoría)
    const cargarRelacionados = async (categoria) => {
      const snapshot = await db
        .collection("producto")
        .where("categoria", "==", categoria)
        .limit(4)
        .get();

      const productos = snapshot.docs
        .filter(doc => doc.id !== id)
        .map(doc => ({ id: doc.id, ...doc.data() }));

      setRelacionados(productos);
    };

    cargarProducto();
  }, []);

  // 4️⃣ Lógica del checkbox de personalización
  useEffect(() => {
    const chk = document.getElementById("chkPersonalizacion");
    const input = document.getElementById("mensajePersonalizado");
    if (!chk || !input) return;
    chk.addEventListener("change", () => {
      input.style.display = chk.checked ? "block" : "none";
    });
  }, []);

  // 5️⃣ Render (deja el HTML igual, solo rellenamos datos dinámicos)
  return (
    <>
      {producto && (
        <div className="container my-5 p-4">
          <div className="row justify-content-center align-items-center g-4">
            <div className="col-12 col-md-5 text-center">
              <img
                className="img-producto-detalle"
                src={producto.img || "../img/default.png"}
                alt={producto.nombre}
              />
            </div>

            <div className="col-12 col-md-6">
              <p className="text-muted mb-2">{producto.categoria}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
                <h2 className="mb-3">{producto.nombre}</h2>
                <h2 className="mb-3">${producto.precio}</h2>
              </div>
              <p className="mb-4">{producto.descripcion}</p>

              <div className="personalizacion">
                <label>
                  <input type="checkbox" id="chkPersonalizacion" /> ¿Deseas añadir un
                  mensaje especial?
                </label>
                <input
                  type="text"
                  id="mensajePersonalizado"
                  className="form-control mt-2"
                  placeholder="Escribe tu mensaje (máx. 30 caracteres)"
                  maxLength="30"
                  style={{ display: "none" }}
                />
              </div>

              <br />

              <div className="cantidad-container-detalle">
                <h3>Cantidad</h3>
                <select id="cantidad" name="cantidad">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <br />

              <div className="botones-container-detalle">
                <button
                  className="boton"
                  style={{ padding: "10px 200px" }}
                  onClick={() => alert("Agregaste al carrito")}
                >
                  Agregar al carrito
                </button>
              </div>

              <br />
              <div className="compartir">
                <p>¡Comparte este producto!</p>
                <button className="btn-facebook">Facebook</button>
                <button className="btn-twitter">Twitter</button>
                <button className="btn-whatsapp">WhatsApp</button>
              </div>
            </div>
          </div>

          {/* Productos relacionados */}
          <main className="container my-5">
            <h2>Productos que te pueden interesar</h2>
            <div className="row g-4 mt-3">
              {relacionados.map((p) => (
                <div key={p.id} className="col-md-3 text-center">
                  <div className="card">
                    <img src={p.img} className="card-img-top" alt={p.nombre} />
                    <div className="card-body">
                      <h5>{p.nombre}</h5>
                      <p>${p.precio}</p>
                      <a href={`detalle-producto.html?id=${p.id}`} className="btn btn-primary">
                        Ver más
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      )}
    </>
  );
};

export default Detalle_producto;
