/*// --- Validaciones básicas ---
function validarCorreo(correo) {
  const regex = /^[\w.+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
  return regex.test(correo);
}
function validarRun(run) {
  const regex = /^[0-9]{7,8}[0-9K]$/;
  return regex.test(run);
}
function esMayorEdad(fecha) {
  if (!fecha) return true; // opcional
  const hoy = new Date();
  const fn = new Date(fecha);
  let edad = hoy.getFullYear() - fn.getFullYear();
  const m = hoy.getMonth() - fn.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < fn.getDate())) edad--;
  return edad >= 18;
}

// --- Regiones y comunas ---
const REGIONES_COMUNAS = {
  "Arica y Parinacota": ["Arica","Camarones","General Lagos","Putre"],
  "Tarapacá": ["Alto Hospicio","Camiña","Colchane","Huara","Iquique","Pica","Pozo Almonte"],
  "Antofagasta": ["Antofagasta","Calama","María Elena","Mejillones","Ollagüe","San Pedro de Atacama","Sierra Gorda","Taltal","Tocopilla"],
  "Atacama": ["Alto del Carmen","Caldera","Chañaral","Copiapó","Diego de Almagro","Freirina","Huasco","Tierra Amarilla","Vallenar"],
  "Coquimbo": ["Andacollo","Canela","Combarbalá","Coquimbo","Illapel","La Higuera","La Serena","Los Vilos","Monte Patria","Ovalle","Paihuano","Punitaqui","Río Hurtado","Salamanca","Vicuña"],
  "Valparaíso": ["Algarrobo","Cabildo","Calera","Calle Larga","Cartagena","Casablanca","Catemu","Concón","El Quisco","El Tabo","Hijuelas","Isla de Pascua","Juan Fernández","La Cruz","La Ligua","Limache","Llaillay","Los Andes","Nogales","Olmué","Panquehue","Papudo","Petorca","Puchuncaví","Putaendo","Quillota","Quilpué","Quintero","Rinconada","San Antonio","San Esteban","San Felipe","Santa María","Santo Domingo","Valparaíso","Villa Alemana","Viña del Mar","Zapallar"],
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

document.addEventListener("DOMContentLoaded", () => {
  // Campos del formulario
  const form = document.getElementById("formUsuario");
  const runInput = document.getElementById("run");
  const nombreInput = document.getElementById("nombre");
  const apellidosInput = document.getElementById("apellidos");
  const correoInput = document.getElementById("correo");
  const fechaInput = document.getElementById("fechaNacimiento");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const direccionInput = document.getElementById("direccion");
  const regionSelect = document.getElementById("region");
  const comunaSelect = document.getElementById("comuna");

  // Mensaje dinámico
  let mensaje = document.getElementById("mensaje");
  if (!mensaje) {
    mensaje = document.createElement("p");
    mensaje.id = "mensaje";
    mensaje.style.color = "brown";
    form.appendChild(mensaje);
  }

  // --- Poblar regiones ---
  if (regionSelect && !regionSelect.dataset.loaded) {
    regionSelect.innerHTML = '<option value="">-- Seleccione la región --</option>';
    Object.keys(REGIONES_COMUNAS).forEach(r => {
      const opt = document.createElement("option");
      opt.value = r;
      opt.textContent = r;
      regionSelect.appendChild(opt);
    });
    regionSelect.dataset.loaded = "1";
  }

  // --- Poblar comunas según región ---
  function cargarComunas(region) {
    comunaSelect.innerHTML = '<option value="">-- Seleccione la comuna --</option>';
    const lista = REGIONES_COMUNAS[region] || [];
    lista.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      comunaSelect.appendChild(opt);
    });
  }

  regionSelect?.addEventListener("change", () => {
    cargarComunas(regionSelect.value);
    comunaSelect.value = ""; // reset
  });

  // Limpieza de errores
  [
    runInput, nombreInput, apellidosInput, correoInput, fechaInput,
    passwordInput, confirmPasswordInput, direccionInput, regionSelect, comunaSelect
  ].forEach(el => el?.addEventListener("input", () => {
    el.setCustomValidity?.("");
    mensaje.textContent = "";
  }));

  // Submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    mensaje.textContent = "";

    // Normalizar RUN
    runInput.value = runInput.value.trim().toUpperCase();

    // Capturar valores
    const run = runInput.value;
    const nombre = nombreInput.value.trim();
    const apellidos = apellidosInput.value.trim();
    const correo = correoInput.value.trim();
    const fecha = fechaInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const direccion = direccionInput.value.trim();
    const region = regionSelect.value;
    const comuna = comunaSelect.value;

    // Validaciones
    if (!validarRun(run)) {
      runInput.setCustomValidity("El RUN es incorrecto. Debe tener 7 u 8 dígitos + número o K verificador.");
      return runInput.reportValidity();
    }
    if (!nombre) {
      nombreInput.setCustomValidity("El nombre es obligatorio.");
      return nombreInput.reportValidity();
    }
    if (!apellidos) {
      apellidosInput.setCustomValidity("Los apellidos son obligatorios.");
      return apellidosInput.reportValidity();
    }
    if (!validarCorreo(correo)) {
      correoInput.setCustomValidity("El correo debe ser '@duoc.cl', '@profesor.duoc.cl' o '@gmail.com'.");
      return correoInput.reportValidity();
    }
    if (fecha && !esMayorEdad(fecha)) {
      fechaInput.setCustomValidity("Debe ser mayor de 18 años para registrarse.");
      return fechaInput.reportValidity();
    }
    if (password.length < 6) {
      passwordInput.setCustomValidity("La contraseña debe tener al menos 6 caracteres.");
      return passwordInput.reportValidity();
    }
    if (password !== confirmPassword) {
      confirmPasswordInput.setCustomValidity("Las contraseñas no coinciden.");
      return confirmPasswordInput.reportValidity();
    }
    if (!region) {
      regionSelect.setCustomValidity("Seleccione una región.");
      return regionSelect.reportValidity();
    }
    if (!comuna) {
      comunaSelect.setCustomValidity("Seleccione una comuna.");
      return comunaSelect.reportValidity();
    }
    if (!direccion) {
      direccionInput.setCustomValidity("La dirección es obligatoria.");
      return direccionInput.reportValidity();
    }

    // OK
    mensaje.textContent = "Formulario enviado correctamente ✅";
    console.log("✅ Datos listos:", {
      run, nombre, apellidos, correo, fecha,
      region, comuna, direccion
    });

    // Aquí podrías guardar en Firestore si corresponde
    // db.collection("usuario").add({...})
  });
});*/
