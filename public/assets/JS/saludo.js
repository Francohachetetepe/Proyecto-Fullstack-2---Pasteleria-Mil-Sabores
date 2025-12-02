// saludo.js

class ClienteManager {
  constructor() {
    // Estado
    this.db = null;
    this.firebaseInicializado = false;
    this.perfil = null;
    this.historial = [];

    // Arranque
    this.init();
  }

  async init() {
    try {
      this.configurarSidebar();
      this.configurarNavegacion(); // Mostrar home por defecto
      await this.inicializarFirebase();
      await this.cargarDatosCliente();
      this.configurarEventos();
    } catch (err) {
      console.error("Error en init:", err);
    }
  }

  // ==================== Firebase ====================
  async inicializarFirebase() {
    try {
      const firebaseConfig = {
        apiKey: "AIzaSyAzRg6nsE4TZgdvMeeU7Nvjo64k7m8HrrE",
        authDomain: "tiendapasteleriamilsabor-de980.firebaseapp.com",
        projectId: "tiendapasteleriamilsabor-de980",
        storageBucket: "tiendapasteleriamilsabor-de980.firebasestorage.app",
        messagingSenderId: "925496431859",
        appId: "1:925496431859:web:ff7f0ae09b002fe94e5386",
        measurementId: "G-1X6TSB46XN"
      };

      // Requiere que el SDK de Firebase esté incluido en tu HTML
      // <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
      // <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js"></script>
      // <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js"></script>

      if (typeof firebase === "undefined") {
        console.warn("Firebase SDK no está cargado. Se usarán datos locales.");
        this.firebaseInicializado = false;
        return;
      }

      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }

      this.db = firebase.firestore();
      this.firebaseInicializado = true;
      console.log("Firebase inicializado");
    } catch (error) {
      console.error("Error inicializando Firebase:", error);
      this.firebaseInicializado = false;
    }
  }

  // ==================== Datos cliente ====================
  async cargarDatosCliente() {
    // Usuario desde localStorage (espera { id, nombre, apellido, email })
    const usuarioStr = localStorage.getItem("usuario");
    if (!usuarioStr) {
      this.mostrarBienvenidaConNombre("¡Bienvenido!");
      this.mostrarResumenHome({
        nombre: "",
        apellido: "",
        email: ""
      });
      this.mostrarHistorial([]); // vacío
      return;
    }

    const usuario = this.safeJSON(usuarioStr, null);
    if (!usuario || !usuario.id) {
      this.mostrarBienvenidaConNombre("¡Bienvenido!");
      return;
    }

    try {
      // Perfil
      let perfil = null;
      if (this.firebaseInicializado) {
        const doc = await this.db.collection("usuario").doc(usuario.id).get();
        perfil = doc.exists ? doc.data() : null;
      }

      // Si no hay Firebase o no existe el doc, usa localStorage como respaldo
      if (!perfil) {
        perfil = {
          nombre: usuario.nombre || "",
          apellido: usuario.apellido || "",
          email: usuario.email || "",
          telefono: usuario.telefono || ""
        };
      }

      this.perfil = perfil;
      // Historial
      let historial = [];
      if (this.firebaseInicializado) {
        const snapshot = await this.db
          .collection("compras")
          .where("usuarioId", "==", usuario.id)
          .get();
        historial = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            fecha: this.formatearFecha(data.fecha),
            producto: data.producto || "Producto",
            total: data.total || 0
          };
        });
      } else {
        // Datos ficticios si no hay Firebase
        historial = [
          { fecha: this.formatearFecha(new Date()), producto: "Brownie", total: 3500 },
          { fecha: this.formatearFecha(new Date(Date.now() - 86400000)), producto: "Torta Selva Negra", total: 18990 }
        ];
      }

      this.historial = historial;

      // Render
      this.mostrarBienvenidaConNombre(this.perfil.nombre || "Cliente");
      this.mostrarResumenHome(this.perfil);
      this.mostrarHistorial(this.historial);
      this.prellenarFormularioPerfil(this.perfil);
    } catch (error) {
      console.error("Error cargando datos del cliente:", error);
      this.mostrarBienvenidaConNombre("¡Bienvenido!");
    }
  }

  // ==================== Navegación y UI ====================
  configurarNavegacion() {
    const links = document.querySelectorAll(".menu-link");
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          e.preventDefault();
          const seccion = href.substring(1);
          this.navegarASeccion(seccion);
        }
      });
    });

    // Mostrar Home por defecto
    this.navegarASeccion("home");
  }

  navegarASeccion(seccion) {
    const sections = document.querySelectorAll("main > section");
    sections.forEach((s) => (s.style.display = "none"));

    const target = document.getElementById(seccion);
    if (target) target.style.display = "block";

    document.querySelectorAll(".menu-link").forEach((l) => {
      l.classList.toggle("active", l.getAttribute("href") === `#${seccion}`);
    });
  }

  configurarSidebar() {
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("toggleSidebar");
    if (sidebar && toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("expanded");
      });
    }
  }

  mostrarBienvenidaConNombre(nombre) {
    const bienvenido = document.getElementById("bienvenido");
    if (bienvenido) bienvenido.innerText = `¡Bienvenido, ${nombre}!`;
  }

  mostrarResumenHome(perfil) {
    this.setText("resumenNombre", perfil?.nombre || "");
    this.setText("resumenApellido", perfil?.apellido || "");
    this.setText("resumenEmail", perfil?.email || "");
  }

  mostrarHistorial(historial) {
    const cont = document.getElementById("historialCompras");
    if (!cont) return;

    cont.innerHTML = "";
    if (!historial || !historial.length) {
      cont.innerHTML = '<li class="list-group-item">No tienes compras registradas.</li>';
      return;
    }

    historial.forEach((c) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
        <span>
          <strong>${c.producto}</strong><br>
          <small>${c.fecha}</small>
        </span>
        <span>$${this.formatearMonto(c.total)}</span>
      `;
      cont.appendChild(li);
    });
  }

  prellenarFormularioPerfil(perfil) {
    this.setValue("nombreClienteInput", perfil?.nombre || "");
    this.setValue("apellidoClienteInput", perfil?.apellido || "");
    this.setValue("emailCliente", perfil?.email || "");
    this.setValue("telefonoCliente", perfil?.telefono || "");
  }

  // ==================== Eventos ====================
  configurarEventos() {
    const btnCerrar = document.getElementById("cerrarSesion");
    if (btnCerrar) {
      btnCerrar.addEventListener("click", () => {
        localStorage.removeItem("usuario");
        window.location.href = "../page/inicio_sesion.html";
      });
    }

    const btnActualizar = document.getElementById("btnActualizarPerfil");
    if (btnActualizar) {
      btnActualizar.addEventListener("click", () => this.actualizarPerfilCliente());
    }
  }

  async actualizarPerfilCliente() {
    const usuarioStr = localStorage.getItem("usuario");
    const usuario = this.safeJSON(usuarioStr, null);
    if (!usuario || !usuario.id) return;

    const nuevoPerfil = {
      nombre: this.getValue("nombreClienteInput"),
      apellido: this.getValue("apellidoClienteInput"),
      email: this.getValue("emailCliente"),
      telefono: this.getValue("telefonoCliente")
    };

    // Contraseña (opcional) con Firebase Auth
    const pass1 = this.getValue("passwordNueva");
    const pass2 = this.getValue("passwordConfirm");
    if (pass1 || pass2) {
      if (pass1 !== pass2) {
        alert("Las contraseñas no coinciden.");
        return;
      }
      if (typeof firebase !== "undefined" && firebase.auth) {
        const user = firebase.auth().currentUser;
        if (user) {
          try {
            await user.updatePassword(pass1);
          } catch (err) {
            console.error("Error actualizando contraseña:", err);
            alert("No se pudo actualizar la contraseña. Vuelve a iniciar sesión.");
            return;
          }
        } else {
          alert("No hay sesión de Auth activa. Vuelve a iniciar sesión.");
          return;
        }
      } else {
        console.warn("Firebase Auth no disponible. Evita guardar contraseñas en Firestore.");
      }
    }

    try {
      if (this.firebaseInicializado) {
        await this.db.collection("usuario").doc(usuario.id).update(nuevoPerfil);
      }
      // Sin Firebase, actualiza localStorage como respaldo
      localStorage.setItem(
        "usuario",
        JSON.stringify({ ...usuario, ...nuevoPerfil })
      );

      this.perfil = { ...this.perfil, ...nuevoPerfil };
      this.mostrarResumenHome(this.perfil);
      this.mostrarBienvenidaConNombre(this.perfil.nombre || "Cliente");
      alert("Perfil actualizado correctamente ✅");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("Hubo un error al actualizar tu perfil ❌");
    }
  }

  // ==================== Utilidades ====================
  setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  setValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
  }

  getValue(id) {
    const el = document.getElementById(id);
    return el ? el.value : "";
  }

  safeJSON(str, fallback) {
    try {
      return JSON.parse(str);
    } catch {
      return fallback;
    }
  }

  formatearFecha(fecha) {
    try {
      const d = fecha instanceof Date ? fecha : new Date(fecha);
      return d.toLocaleDateString("es-CL", { year: "numeric", month: "short", day: "numeric" });
    } catch {
      return "";
    }
  }

  formatearMonto(n) {
    try {
      return Number(n).toLocaleString("es-CL");
    } catch {
      return n;
    }
  }
}

// Inicialización segura
document.addEventListener("DOMContentLoaded", () => {
  try {
    window.clienteManager = new ClienteManager();
  } catch (err) {
    console.error("Error creando ClienteManager:", err);
  }
});