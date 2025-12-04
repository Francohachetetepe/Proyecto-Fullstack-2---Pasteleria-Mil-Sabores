document.addEventListener("DOMContentLoaded", () => {
    // 🔹 Obtener usuario de localStorage
    const usuarioStr = localStorage.getItem("usuario");
    if (!usuarioStr) return; // No hay usuario logueado
    const usuario = JSON.parse(usuarioStr);

    // 🔹 Configuración Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyAzRg6nsE4TZgdvMeeU7Nvjo64k7m8HrrE",
        authDomain: "tiendapasteleriamilsabor-de980.firebaseapp.com",
        projectId: "tiendapasteleriamilsabor-de980",
        storageBucket: "tiendapasteleriamilsabor-de980.firebasestorage.app",
        messagingSenderId: "925496431859",
        appId: "1:925496431859:web:ff7f0ae09b002fe94e5386",
        measurementId: "G-1X6TSB46XN"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.firestore();

    // 🔹 Campos perfil
    const camposView = {
        nombre: document.getElementById("view_nombre"),
        correo: document.getElementById("view_correo"),
    };

    const camposEdit = {
        nombre: document.getElementById("edit_nombre"),
        correo: document.getElementById("edit_correo"),
    };

    function rellenarPerfil() {
        camposView.nombre.textContent = usuario.nombre;
        camposView.correo.textContent = usuario.correo;

        camposEdit.nombre.value = usuario.nombre;
        camposEdit.correo.value = usuario.correo;

        // Saludos dinámicos
        const sidebarName = document.getElementById("sidebarUserName");
        if (sidebarName) sidebarName.textContent = usuario.nombre;

        const bienvenido = document.getElementById("bienvenido");
        if (bienvenido) bienvenido.textContent = `Bienvenido ${usuario.nombre}!`;
    }

    rellenarPerfil();

    // 🔹 Editar nombre
    const btnEditar = document.getElementById("btnEditarPerfil");
    const btnGuardar = document.getElementById("btnGuardarNombre");
    const vista = document.getElementById("perfil-view");
    const edicion = document.getElementById("perfil-edit");

    btnEditar.addEventListener("click", () => {
        vista.style.display = "none";
        edicion.style.display = "block";
    });

    btnGuardar.addEventListener("click", () => {
        const nuevoNombre = camposEdit.nombre.value.trim();
        if (nuevoNombre.length < 1) {
            alert("El nombre no puede estar vacío.");
            return;
        }
        usuario.nombre = nuevoNombre;
        localStorage.setItem("usuario", JSON.stringify(usuario));
        rellenarPerfil();
        vista.style.display = "block";
        edicion.style.display = "none";
        console.log("Nombre actualizado a:", nuevoNombre);
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
            // .orderBy("fecha", "desc")
            .get()
            .then(querySnapshot => {
                ordenesLista.innerHTML = "";
                if (querySnapshot.empty) {
                    ordenesLista.innerHTML = "<p>No has realizado órdenes todavía.</p>";
                    return;
                }

                querySnapshot.forEach(doc => {
                    const compra = doc.data();
                    const estado = compra.estado || "pendiente"; // fallback
                    let mensaje = "";

                    switch (estado.toLowerCase()) {
                        case "completada":
                            mensaje = `✅ Orden ${compra.numeroOrden} realizada con éxito`;
                            break;
                        case "en curso":
                            mensaje = `⏳ Orden ${compra.numeroOrden} en curso`;
                            break;
                        case "rechazada":
                            mensaje = `❌ Orden ${compra.numeroOrden} rechazada`;
                            break;
                        default:
                            mensaje = `ℹ️ Orden ${compra.numeroOrden} estado: ${estado}`;
                    }

                    const div = document.createElement("div");
                    div.className = "orden mb-2 p-2 border rounded";
                    div.textContent = mensaje;

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
