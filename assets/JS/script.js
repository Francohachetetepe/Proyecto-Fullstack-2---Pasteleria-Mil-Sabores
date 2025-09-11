document.addEventListener("DOMContentLoaded", function() {
    actualizarContadorCarrito();

    const textoUsuario = document.getElementById("textoUsuario");
    const btnIniciarSesion = document.getElementById("usuarioAccion");
    const btnCrearCuenta = document.querySelector(".btn-crear-cuenta");
    const logoutBtn = document.getElementById("logoutBtn");

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (isLoggedIn) {
        textoUsuario.textContent = "Mi perfil";
        btnIniciarSesion.textContent = "Ver perfil";
        btnIniciarSesion.onclick = () => window.location.href = "perfil.html";
        logoutBtn.style.display = "block";
    } else {
        textoUsuario.textContent = "Iniciar sesión";
        btnIniciarSesion.textContent = "Iniciar sesión";
        btnIniciarSesion.onclick = () => window.location.href = "inicio_sesion.html";
        logoutBtn.style.display = "none";
    }

    btnCrearCuenta.onclick = () => window.location.href = "registrar_usuario.html";

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("isLoggedIn");
        location.reload();
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const regiones = {
        "Arica y Parinacota": ["Arica", "Camarones", "General Lagos", "Putre"],
        "Tarapacá": ["Alto Hospicio", "Camiña", "Colchane", "Huara", "Iquique", "Pica", "Pozo Almonte"],
        "Antofagasta": ["Antofagasta", "Calama", "María Elena", "Mejillones", "Ollagüe", "San Pedro de Atacama", "Sierra Gorda", "Taltal", "Tocopilla"],
        "Atacama": ["Alto del Carmen", "Caldera", "Chañaral", "Copiapó", "Diego de Almagro", "Freirina", "Huasco", "Tierra Amarilla", "Vallenar"],
        "Coquimbo": ["Andacollo", "Canela", "Combarbalá", "Coquimbo", "Illapel", "La Higuera", "La Serena", "Los Vilos", "Monte Patria", "Ovalle", "Paihuano", "Punitaqui", "Río Hurtado", "Salamanca", "Vicuña"],
        "Valparaíso": ["Algarrobo", "Cabildo", "Calera", "Calle Larga", "Cartagena", "Casablanca", "Catemu", "Concón", "El Quisco", "El Tabo", "Hijuelas", "Isla de Pascua", "Juan Fernández", "La Cruz", "La Ligua", "Limache", "Llaillay", "Los Andes", "Nogales", "Olmué", "Panquehue", "Papudo", "Petorca", "Puchuncaví", "Putaendo", "Quillota", "Quilpué", "Quintero", "Rinconada", "San Antonio", "San Esteban", "San Felipe", "Santa María", "Santo Domingo", "Valparaíso", "Villa Alemana", "Viña del Mar", "Zapallar"],
        "Metropolitana de Santiago": ["Alhué","Buin","Calera de Tango","Cerrillos","Cerro Navia","Colina","Conchalí","Curacaví","El Bosque","El Monte","Estación Central","Huechuraba","Independencia","Isla de Maipo","La Cisterna","La Florida","La Granja","La Pintana","La Reina","Lampa","Las Condes","Lo Barnechea","Lo Espejo","Lo Prado","Macul","Maipú","María Pinto","Melipilla","Ñuñoa","Padre Hurtado","Paine","Pedro Aguirre Cerda","Peñaflor","Peñalolén","Pirque","Providencia","Pudahuel","Puente Alto","Quilicura","Quinta Normal","Recoleta","Renca","San Bernardo","San Joaquín","San José de Maipo","San Miguel","San Pedro","San Ramón","Santiago","Talagante","Tiltil","Vitacura"],
        "O’Higgins": ["Chépica","Chimbarongo","Codegua","Coinco","Coltauco","Doñihue","Graneros","La Estrella","Las Cabras","Litueche","Lolol","Machalí","Malloa","Marchihue","Mostazal","Nancagua","Navidad","Olivar","Palmilla","Paredones","Peralillo","Peumo","Pichidegua","Pichilemu","Placilla","Pumanque","Quinta de Tilcoco","Rancagua","Rengo","Requínoa","San Fernando","San Vicente","Santa Cruz"],
        "Maule": ["Cauquenes","Chanco","Colbún","Constitución","Curepto","Curicó","Empedrado","Hualañé","Licantén","Linares","Longaví","Maule","Molina","Parral","Pelarco","Pelluhue","Pencahue","Rauco","Retiro","Río Claro","Romeral","Sagrada Familia","San Clemente","San Javier","San Rafael","Talca","Teno","Vichuquén","Villa Alegre","Yerbas Buenas"],
        "Ñuble": ["Bulnes","Chillán","Chillán Viejo","Cobquecura","Coelemu","Coihueco","El Carmen","Ninhue","Ñiquén","Pemuco","Pinto","Portezuelo","Quillón","Quirihue","Ránquil","San Carlos","San Fabián","San Ignacio","San Nicolás","Treguaco","Yungay"],
        "Biobío": ["Alto Biobío","Antuco","Arauco","Cabrero","Cañete","Chiguayante","Concepción","Contulmo","Coronel","Curanilahue","Florida","Hualpén","Hualqui","Laja","Lebu","Los Álamos","Los Ángeles","Lota","Mulchén","Nacimiento","Negrete","Penco","Quilaco","Quilleco","San Pedro de la Paz","San Rosendo","Santa Bárbara","Santa Juana","Talcahuano","Tirúa","Tomé","Tucapel","Yumbel"],
        "La Araucanía": ["Angol","Carahue","Cholchol","Collipulli","Cunco","Curacautín","Curarrehue","Ercilla","Freire","Galvarino","Gorbea","Lautaro","Loncoche","Lonquimay","Los Sauces","Lumaco","Melipeuco","Nueva Imperial","Padre Las Casas","Perquenco","Pitrufquén","Pucón","Purén","Renaico","Saavedra","Temuco","Teodoro Schmidt","Toltén","Traiguén","Victoria","Vilcún","Villarrica"],
        "Los Ríos": ["Corral","Futrono","La Unión","Lago Ranco","Lanco","Los Lagos","Máfil","Mariquina","Paillaco","Panguipulli","Río Bueno","Valdivia"],
        "Los Lagos": ["Ancud","Calbuco","Castro","Chaitén","Chonchi","Cochamó","Curaco de Vélez","Dalcahue","Fresia","Frutillar","Futaleufú","Hualaihué","Llanquihue","Los Muermos","Maullín","Osorno","Palena","Puerto Montt","Puerto Octay","Puerto Varas","Puqueldón","Queilén","Quellón","Quemchi","Quinchao","Río Negro","San Juan de la Costa","San Pablo"],
        "Aysén": ["Aysén","Chile Chico","Cisnes","Cochrane","Coyhaique","Guaitecas","Lago Verde","O’Higgins","Río Ibáñez","Tortel"],
        "Magallanes y la Antártica": ["Antártica","Cabo de Hornos","Laguna Blanca","Natales","Porvenir","Primavera","Punta Arenas","Río Verde","San Gregorio","Timaukel","Torres del Paine"]
    };
    
    const regionSelect = document.getElementById("region");
    const comunaSelect = document.getElementById("comuna");
    const form = document.getElementById("formRegistro");

    if (regionSelect) {
        Object.keys(regiones).forEach(region => {
            const opt = document.createElement("option");
            opt.value = region;
            opt.textContent = region;
            regionSelect.appendChild(opt);
        });
    }
    
    if (regionSelect && comunaSelect) {
        regionSelect.addEventListener("change", function () {
            comunaSelect.innerHTML = '<option value="">-- Seleccione la comuna --</option>';
            if (regiones[this.value]) {
                regiones[this.value].forEach(comuna => {
                    const opt = document.createElement("option");
                    opt.value = comuna;
                    opt.textContent = comuna;
                    comunaSelect.appendChild(opt);
                });
            }
        });
    }

    // --- CARGAR FORMULARIO GUARDADO ---
    const savedData = JSON.parse(localStorage.getItem("formRegistro")) || {};
    Object.keys(savedData).forEach(id => {
        if (document.getElementById(id)) {
            document.getElementById(id).value = savedData[id];
        }
    });

    // --- GUARDAR FORMULARIO AL ESCRIBIR ---
    form.addEventListener("input", () => {
        const data = {};
        [...form.elements].forEach(el => {
            if (el.id) data[el.id] = el.value;
        });
        localStorage.setItem("formRegistro", JSON.stringify(data));
    });

    // --- VALIDACIONES Y SUBMIT ---
    form.addEventListener("submit", function(e){
        e.preventDefault();
        // aquí va todo tu código de validación y guardado de usuario
    });

    // ---- VALIDACIÓN RUN ----
    function validarRun(run) {
        run = run.replace(/\s+/g, "").toUpperCase(); // limpiar espacios y mayúsculas
        if (!/^\d{7,8}[0-9K]$/.test(run)) return false; // debe tener 7-8 dígitos + DV

        const cuerpo = run.slice(0, -1);
        const dv = run.slice(-1);

        let suma = 0;
        let multiplo = 2;

        for (let i = cuerpo.length - 1; i >= 0; i--) {
            suma += parseInt(cuerpo[i], 10) * multiplo;
            multiplo = multiplo < 7 ? multiplo + 1 : 2;
        }
        const resto = suma % 11;
        const dvEsperado = resto === 0 ? "0" : resto === 1 ? "K" : String(11 - resto);
        return dv === dvEsperado;
    }

    // ---- VALIDACIÓN CORREO ----
    function validarCorreo(correo) {
        const regex = /^[\w._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
        return regex.test(correo);
    }

    // Cargar usuarios previos desde localStorage
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Validación al enviar formulario
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let valido = true;

        const run = document.getElementById("run");
        const correo = document.getElementById("correo");
        const password = document.getElementById("password");
        const confirmPassword = document.getElementById("confirmPassword");

        // RUN
        if (!validarRun(run.value.trim())) {
            run.classList.add("is-invalid");
            valido = false;
        } else {
            run.classList.remove("is-invalid");
            run.classList.add("is-valid");
        }

        // Correo
        if (!validarCorreo(correo.value.trim())) {
            correo.classList.add("is-invalid");
            valido = false;
        } else {
            correo.classList.remove("is-invalid");
            correo.classList.add("is-valid");
        }

        // Contraseña
        if (password.value.length < 6) {
            password.classList.add("is-invalid");
            valido = false;
        } else {
            password.classList.remove("is-invalid");
            password.classList.add("is-valid");
        }

        // Confirmar contraseña
        if (password.value !== confirmPassword.value || confirmPassword.value === "") {
            confirmPassword.classList.add("is-invalid");
            valido = false;
        } else {
            confirmPassword.classList.remove("is-invalid");
            confirmPassword.classList.add("is-valid");
        }

        // Guardar usuario si todo ok
        if (valido) {
            const nuevoUsuario = {
                run: run.value.trim(),
                nombre: document.getElementById("nombre").value.trim(),
                apellidos: document.getElementById("apellidos").value.trim(),
                correo: correo.value.trim(),
                password: password.value,
                fechaNacimiento: document.getElementById("fechaNacimiento").value,
                region: regionSelect.value,
                comuna: comunaSelect.value,
                direccion: document.getElementById("direccion").value.trim(),
                codigoPromo: document.getElementById("codigoPromo")?.value.trim()
            };
            
            const hoy = new Date();
            let beneficios = [];
            
            // 1) Mayores de 50 años → 50% descuento
            if (nuevoUsuario.fechaNacimiento) {
                const fechaNac = new Date(nuevoUsuario.fechaNacimiento);
                let edad = hoy.getFullYear() - fechaNac.getFullYear();
                const mes = hoy.getMonth() - fechaNac.getMonth();
                if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
                    edad--;
                }
                if (edad >= 50) {
                    beneficios.push("🎉 Descuento del 50% en todos los productos");
                }
                
                // 3) Estudiantes DUOC → torta gratis en su cumpleaños
                const correo = nuevoUsuario.correo.toLowerCase();
                if ((correo.endsWith("@duoc.cl") || correo.endsWith("@profesor.duoc.cl")) &&
                fechaNac.getDate() === hoy.getDate() &&
                fechaNac.getMonth() === hoy.getMonth()) {
                    beneficios.push("🎂 ¡Feliz cumpleaños! Obtienes una torta gratis 🎁");
                }
            }
            
            // 2) Código FELICES50 → 10% de descuento
            if (nuevoUsuario.codigoPromo?.toUpperCase() === "FELICES50") {
                beneficios.push("🎊 Tienes 10% de descuento de por vida");
            }
            
            if (beneficios.length > 0) {
                alert("✅ Registro exitoso\n\n" + beneficios.join("\n"));
            } else {
                alert("✅ Usuario registrado correctamente!");
            }
            
            // Guardar en localStorage
            if (usuarios.some(u => u.correo === nuevoUsuario.correo)) {
                alert("⚠️ Ya existe un usuario con este correo.");
                return;
            }
            
            usuarios.push(nuevoUsuario);
            localStorage.setItem("usuarios", JSON.stringify(usuarios));
            form.reset();
            window.location.href = "index.html"; 
            document.querySelectorAll(".is-valid").forEach(el => el.classList.remove("is-valid"));
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const togglePass = document.getElementById("togglePass");
    const passwordInput = document.getElementById("password");
    const formLogin = document.getElementById("formLogin");
    
    togglePass.addEventListener("click", () => {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePass.textContent = "Ocultar";
        } else {
            passwordInput.type = "password";
            togglePass.textContent = "Mostrar";
        }
    });
    
    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const correo = document.getElementById("correo").value.trim();
        const password = document.getElementById("password").value;
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        
        const usuario = usuarios.find(u => u.correo === correo);
        
        if (!usuario) {
            document.getElementById("correo").classList.add("is-invalid");
            return;
        } else {
            document.getElementById("correo").classList.remove("is-invalid");
        }
        
        if (usuario.password !== password) {
            document.getElementById("password").classList.add("is-invalid");
            return;
        } else {
            document.getElementById("password").classList.remove("is-invalid");
        }
        
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
        alert("✅ Sesión iniciada correctamente!");
        form.reset();
        window.location.href = "index.html";
    });
});

// Lista de productos
const productos = [
  {codigo:"TC001", categoria:"Tortas Cuadradas", nombre:"Torta Cuadrada de Chocolate", precio:45000, img:"TC001.jpg"},
  {codigo:"TC002", categoria:"Tortas Cuadradas", nombre:"Torta Cuadrada de Frutas", precio:50000, img:"TC002.jpg"},
  {codigo:"TT001", categoria:"Tortas Circulares", nombre:"Torta Circular de Vainilla", precio:40000, img:"TT001.jpg"},
  {codigo:"TT002", categoria:"Tortas Circulares", nombre:"Torta Circular de Manjar", precio:42000, img:"TT002.jpg"},
  {codigo:"PI001", categoria:"Postres Individuales", nombre:"Mousse de Chocolate", precio:5000, img:"PI001.jpg"},
  {codigo:"PI002", categoria:"Postres Individuales", nombre:"Tiramisú Clásico", precio:5500, img:"PI002.jpg"},
  {codigo:"PSA001", categoria:"Productos Sin Azúcar", nombre:"Torta Sin Azúcar de Naranja", precio:48000, img:"PSA001.jpg"},
  {codigo:"PSA002", categoria:"Productos Sin Azúcar", nombre:"Cheesecake Sin Azúcar", precio:47000, img:"PSA002.jpg"},
  {codigo:"PT001", categoria:"Pastelería Tradicional", nombre:"Empanada de Manzana", precio:3000, img:"PT001.jpg"},
  {codigo:"PT002", categoria:"Pastelería Tradicional", nombre:"Tarta de Santiago", precio:6000, img:"PT002.jpg"},
  {codigo:"PG001", categoria:"Productos Sin Gluten", nombre:"Brownie Sin Gluten", precio:4000, img:"PG001.jpg"},
  {codigo:"PG002", categoria:"Productos Sin Gluten", nombre:"Pan Sin Gluten", precio:3500, img:"PG002.jpg"},
  {codigo:"PV001", categoria:"Productos Vegana", nombre:"Torta Vegana de Chocolate", precio:50000, img:"PV001.jpeg"},
  {codigo:"PV002", categoria:"Productos Vegana", nombre:"Galletas Veganas de Avena", precio:4500, img:"PV002.jpg"},
  {codigo:"TE001", categoria:"Tortas Especiales", nombre:"Torta Especial de Cumpleaños", precio:55000, img:"TE001.jpg"},
  {codigo:"TE002", categoria:"Tortas Especiales", nombre:"Torta Especial de Boda", precio:60000, img:"TE002.jpg"}
];

function mostrarProductos(categoria = "") {
  const contenedor = document.getElementById("contenedorProductos");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  const filtrados = categoria
    ? productos.filter((prod) => prod.categoria === categoria)
    : productos;

  filtrados.forEach((prod) => {
    const div = document.createElement("div");
    div.classList.add("col-md-3", "mb-4"); // 👈 ahora 4 por fila

    div.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="../img/${prod.img}" class="card-img-top" alt="${prod.nombre}" style="object-fit: cover; height: 200px;">
        <div class="card-body p-3 d-flex flex-column">
          <h5 class="card-title mb-2">${prod.nombre}</h5>
          <p class="card-text mb-2"><strong>$${prod.precio.toLocaleString()}</strong></p>
          <button class="btn btn-primary mt-auto" onclick="alert('Agregaste ${prod.nombre} al carrito')">Agregar al carrito</button>
        </div>
      </div>
    `;

    contenedor.appendChild(div);
  });
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const categoria = params.get("categoria");
  
  if (document.getElementById("contenedorProductos")) {
    if (categoria) {
      mostrarProductos(categoria);
    } else {
      mostrarProductos();
    }
  }
  
  renderCarrito();
});

// Selecciona 3 productos aleatorios
function obtenerProductosAleatorios() {
    const copia = [...productos];
    let seleccionados = [];
    for (let i = 0; i < 3; i++) {
        const index = Math.floor(Math.random() * copia.length);
        seleccionados.push(copia.splice(index, 1)[0]);
    }
    return seleccionados;
}

// Renderizar carrito
function mostrarCarrito() {
    const itemsCarrito = document.getElementById("itemsCarrito");
    if (!itemsCarrito) return;

    const productosCarrito = obtenerProductosAleatorios();
    itemsCarrito.innerHTML = "";

    productosCarrito.forEach((prod, i) => {
        let div = document.createElement("div");
        div.classList.add("card", "mb-3", "shadow-sm");
        div.style.minHeight = "200px"; // 👈 altura mínima para uniformidad
        div.innerHTML = `
            <div class="row g-0">
                <div class="col-md-4 d-flex align-items-center">
                    <img src="../img/${prod.img}" class="img-fluid rounded-start" 
                         alt="${prod.nombre}" style="object-fit: cover; height: 100%; max-height: 200px; width: 100%;">
                </div>
                <div class="col-md-8 d-flex flex-column">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${prod.nombre}</h5>
                        <p class="card-text">Aquí va la descripción</p>
                        <p class="card-text"><strong>Precio: $${prod.precio.toLocaleString()}</strong></p>
                        
                        <div class="mt-auto d-flex justify-content-end gap-3">
                            <a href="#" class="text-secondary d-flex align-items-center text-decoration-none">
                                <i class="bi bi-pencil-square me-1"></i> Editar
                            </a>
                            <a href="#" class="text-danger d-flex align-items-center text-decoration-none">
                                <i class="bi bi-trash3 me-1"></i> Eliminar
                            </a>
                        </div>

                        <div class="d-flex align-items-center gap-2 mt-auto">
                            <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${i}, -1)">-</button>
                            <input type="number" id="cantidad-${i}" 
                                   class="form-control text-center" value="1" min="1" style="width:70px">
                            <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${i}, 1)">+</button>
                        </div>

                        <p class="mt-2">Subtotal: 
                            <span id="subtotal-${i}">$${prod.precio.toLocaleString()}</span>
                        </p>
                    </div>
                </div>
            </div>
        `;
        itemsCarrito.appendChild(div);
    });

    // Guardamos en memoria global para acceder luego
    window.productosCarrito = productosCarrito;
    actualizarTotal();
}


// Cambiar cantidad con botones + -
function cambiarCantidad(index, delta) {
    const input = document.getElementById(`cantidad-${index}`);
    let nuevaCantidad = parseInt(input.value) + delta;
    if (nuevaCantidad < 1) nuevaCantidad = 1;
    input.value = nuevaCantidad;
    actualizarSubtotal(index);
}

// Actualizar subtotal al escribir manualmente
document.addEventListener("input", (e) => {
    if (e.target && e.target.id.startsWith("cantidad-")) {
        const index = e.target.id.split("-")[1];
        actualizarSubtotal(index);
    }
});

function actualizarSubtotal(index) {
    const cantidad = parseInt(document.getElementById(`cantidad-${index}`).value);
    const prod = window.productosCarrito[index];
    const subtotal = cantidad * prod.precio;
    document.getElementById(`subtotal-${index}`).textContent = `$${subtotal.toLocaleString()}`;
    actualizarTotal();
}

let descuentoActivo = 0;

// Actualizar subtotales y total
function actualizarTotal() {
  let subtotal = 0;
  window.productosCarrito.forEach((prod, i) => {
    const cantidad = parseInt(document.getElementById(`cantidad-${i}`).value);
    subtotal += cantidad * prod.precio;
  });

  // mostrar subtotal
  document.getElementById("subtotalCarrito").textContent = `$${subtotal.toLocaleString()}`;
  document.getElementById("descuentoCarrito").textContent = `$${descuentoActivo.toLocaleString()}`;

  const total = subtotal - descuentoActivo;
  document.getElementById("totalCarrito").textContent = `$${total.toLocaleString()}`;
}

// Aplicar código de descuento
function aplicarDescuento() {
  const codigo = document.getElementById("codigoDescuento").value.trim().toLowerCase();

  if (codigo === "pastelito10") {
    descuentoActivo = 5000; // monto fijo (ejemplo)
    alert("¡Código aplicado con éxito! 🎉");
  } else {
    descuentoActivo = 0;
    alert("Código no válido 😢");
  }

  actualizarTotal();
}

// Ejecutar al cargar carrito
document.addEventListener("DOMContentLoaded", mostrarCarrito);