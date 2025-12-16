document.addEventListener("DOMContentLoaded", () => {

    const usuarioStr = localStorage.getItem("usuario");
    if (!usuarioStr) return;

    let usuario = JSON.parse(usuarioStr);

    const firebaseConfig = {
        apiKey: "AIzaSyAzRg6nsE4TZgdvMeeU7Nvjo64k7m8HrrE",
        authDomain: "tiendapasteleriamilsabor-de980.firebaseapp.com",
        projectId: "tiendapasteleriamilsabor-de980"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    const db = firebase.firestore();

    const inputNombre = document.getElementById("profileNombre");
    const inputCorreo = document.getElementById("profileCorreo");
    const btnEditar = document.getElementById("btnEditarPerfil");
    const btnGuardar = document.getElementById("btnGuardarPerfil");

    if (!inputNombre || !btnEditar || !btnGuardar) {
        console.warn("Perfil vendedor: elementos no encontrados");
        return;
    }

    // 🔹 cargar datos
    inputNombre.value = usuario.nombre;
    inputCorreo.value = usuario.correo;

    // 🔹 obtener ID real
    db.collection("usuario")
        .where("correo", "==", usuario.correo)
        .limit(1)
        .get()
        .then(snapshot => {
            if (!snapshot.empty) {
                usuario.id = snapshot.docs[0].id;
                localStorage.setItem("usuario", JSON.stringify(usuario));
            }
        });

    // 🔹 EDITAR
    btnEditar.addEventListener("click", () => {
        inputNombre.removeAttribute("readonly");
        inputNombre.focus();

        btnEditar.style.display = "none";
        btnGuardar.style.display = "inline-block";
    });

    // 🔹 GUARDAR
    btnGuardar.addEventListener("click", () => {
        const nuevoNombre = inputNombre.value.trim();
        if (!nuevoNombre) {
            alert("Nombre vacío");
            return;
        }

        db.collection("usuario")
            .doc(usuario.id)
            .update({ nombre: nuevoNombre })
            .then(() => {
                usuario.nombre = nuevoNombre;
                localStorage.setItem("usuario", JSON.stringify(usuario));

                inputNombre.setAttribute("readonly", true);
                btnGuardar.style.display = "none";
                btnEditar.style.display = "inline-block";
            })
            .catch(err => {
                console.error(err);
                alert("Error al guardar");
            });
        });

    // 🔹 Navegación sidebar
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                document.querySelectorAll('.seccion').forEach(sec => sec.style.display = 'none');
                const seccion = document.querySelector(href);
                if (seccion) seccion.style.display = 'block';
            }
        });
    });

    // Mostrar home por defecto
    document.querySelectorAll('.seccion').forEach(sec => sec.style.display = 'none');
    document.getElementById('home').style.display = 'block';

    // 🔹 Historial de compras
    const historialLista = document.getElementById("historial-lista");

    function mostrarHistorial() {
        historialLista.innerHTML = "<p>Cargando historial...</p>";

        db.collection("compras")
            .where("cliente.correo", "==", usuario.correo)
            // .orderBy("fecha", "desc")
            .get()
            .then(querySnapshot => {
                historialLista.innerHTML = "";
                if (querySnapshot.empty) {
                    historialLista.innerHTML = "<p>No tienes compras todavía.</p>";
                    return;
                }

                querySnapshot.forEach(doc => {
                    const compra = doc.data();
                    const productos = compra.productos.map(p => p.nombre).join(", ");
                    const fechaCompra = compra.fecha.toDate().toLocaleString();

                    historialLista.innerHTML += `
                        <div class="compra mb-3 p-2 border rounded">
                            <p><strong>ID Pedido:</strong> ${compra.numeroOrden}</p>
                            <p><strong>Fecha:</strong> ${fechaCompra}</p>
                            <p><strong>Estado:</strong> ${compra.estado}</p>
                            <p><strong>Total:</strong> $${compra.total}</p>
                            <p><strong>Productos:</strong> ${productos}</p>
                        </div>
                    `;
                });
            })
            .catch(error => {
                console.error("Error cargando historial:", error);
                historialLista.innerHTML = "<p>Error cargando el historial.</p>";
            });
    }

    mostrarHistorial();

    // 🔹 Historial de contacto
    const contactosLista = document.getElementById("contacto-lista");

    function mostrarContactos() {
        contactosLista.innerHTML = "<p>Cargando historial de contactos...</p>";

        db.collection("contacto")
          .where("email", "==", usuario.correo.trim().toLowerCase())
        //   .orderBy("createdAt", "desc")
          .get()
          .then(querySnapshot => {
              contactosLista.innerHTML = "";
              if (querySnapshot.empty) {
                  contactosLista.innerHTML = "<p>No tienes solicitudes de contacto.</p>";
                  return;
              }

              querySnapshot.forEach(doc => {
                  const contacto = doc.data();
                  const docId = doc.id;

                  contactosLista.innerHTML += `
                      <div class="contacto mb-3 p-2 border rounded">
                          <p><strong>Tipo:</strong> ${contacto.tipo}</p>
                          <p><strong>Nombre:</strong> ${contacto.nombre}</p>
                          <p><strong>Mensaje:</strong> ${contacto.mensaje}</p>
                          <p><strong>Fecha:</strong> ${new Date(contacto.createdAt.seconds*1000).toLocaleString()}</p>
                          <button class="btn btn-danger btn-sm eliminar-contacto" data-id="${docId}">Eliminar</button>
                      </div>
                  `;
              });

              // Botones eliminar
              const botonesEliminar = document.querySelectorAll(".eliminar-contacto");
              botonesEliminar.forEach(btn => {
                  btn.addEventListener("click", () => {
                      const id = btn.getAttribute("data-id");
                      if (confirm("¿Seguro quieres eliminar este contacto?")) {
                          db.collection("contacto").doc(id).delete()
                            .then(() => {
                                mostrarContactos(); // recarga la lista
                                console.log("Contacto eliminado:", id);
                            })
                            .catch(error => {
                                console.error("Error eliminando contacto:", error);
                            });
                      }
                  });
              });
          })
          .catch(error => {
              console.error("Error cargando contactos:", error);
              contactosLista.innerHTML = "<p>Error cargando el historial de contactos.</p>";
          });
    }

    mostrarContactos();

    // 🔹 Ordenes en home
    const ordenesLista = document.getElementById("ordenes-lista");

    function mostrarOrdenesHome() {
    ordenesLista.innerHTML = "<p>Cargando tus órdenes...</p>";

    db.collection("compras")
        .where("cliente.correo", "==", usuario.correo)
        .get()
        .then(querySnapshot => {
            ordenesLista.innerHTML = "";
            if (querySnapshot.empty) {
                ordenesLista.innerHTML = "<p>No has realizado órdenes todavía.</p>";
                return;
            }

            querySnapshot.forEach(doc => {
                const compra = doc.data();
                const producto = compra.productos[0]; // tomamos el primer producto para mostrar imagen

                // Crear tarjeta
                const div = document.createElement("div");
                div.className = "orden-item";

                div.innerHTML = `
                    <img src="${producto.image}" alt="${producto.nombre}" class="orden-img">
                    <div class="orden-info">
                        <h4>Orden ${compra.numeroOrden}</h4>
                        <p>📅 ${compra.fecha.toDate().toLocaleString()}</p>
                        <p>💳 Total: $${compra.total.toLocaleString()}</p>
                        <span class="estado ${compra.estado.toLowerCase()}">${compra.estado}</span>
                    </div>
                    <a href="#" class="btn-detalle">Ver detalles</a>
                `;

                ordenesLista.appendChild(div);
            });
        })
        .catch(error => {
            console.error("Error cargando órdenes:", error);
            ordenesLista.innerHTML = "<p>Error cargando tus órdenes.</p>";
        });
}

    mostrarOrdenesHome();

    // 🔹 Cerrar sesión
    const btnCerrar = document.getElementById("cerrarSesion");
    if (btnCerrar) {
        btnCerrar.addEventListener("click", () => {
            localStorage.removeItem("usuario");
            window.location.href = "../../index.html";
        });
    }
});
