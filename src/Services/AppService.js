import { validarRun, validarCorreo, validarPassword, validarEdad, validarCodigoPromo } from '../utils/validaciones';
import { db } from '../config/firebase';

export class UserManager {
    constructor() {
        this.usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    }

    login(correo, password) {
        const usuario = this.usuarios.find(u => u.correo === correo);
        if (!usuario || usuario.password !== password) {
            return { success: false, message: "Credenciales inválidas" };
        }
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
        return { success: true, usuario };
    }

    registro(userData) {
        // Validaciones
        if (!validarRun(userData.run)) {
            return { success: false, message: "RUT inválido" };
        }
        if (!validarCorreo(userData.correo)) {
            return { success: false, message: "Correo inválido" };
        }
        if (this.usuarios.some(u => u.correo === userData.correo)) {
            return { success: false, message: "Correo ya registrado" };
        }

        // Calcular beneficios
        const beneficios = [];
        const edad = validarEdad(userData.fechaNacimiento);

        if (edad >= 50) {
            beneficios.push("🎉 Descuento del 50% en todos los productos");
        }

        if (validarCodigoPromo(userData.codigoPromo)) {
            beneficios.push("🎊 Tienes 10% de descuento de por vida");
        }

        // Verificar si es estudiante DUOC y cumpleaños
        const correo = userData.correo.toLowerCase();
        const hoy = new Date();
        const fechaNac = new Date(userData.fechaNacimiento);
        if ((correo.endsWith("@duoc.cl") || correo.endsWith("@profesor.duoc.cl")) &&
            fechaNac.getDate() === hoy.getDate() &&
            fechaNac.getMonth() === hoy.getMonth()) {
            beneficios.push("🎂 ¡Feliz cumpleaños! Obtienes una torta gratis 🎁");
        }

        // Guardar usuario
        const nuevoUsuario = { ...userData, beneficios };

        //en localStorage
        this.usuarios.push(nuevoUsuario);
        localStorage.setItem("usuarios", JSON.stringify(this.usuarios));

        //en firebase
        addUser(nuevoUsuario)
        .then((docRef) => {
            console.log("Usuario guardado en Firebase con ID:", docRef.id);
        })
        .catch((error) => {
            console.error("Error guardando en Firebase:", error);
        });
        
        return { success: true, message: "Registro exitoso", beneficios };
    }

    logout() {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("usuarioActivo");
    }

    getUsuarioActivo() {
        return JSON.parse(localStorage.getItem("usuarioActivo"));
    }
}

export class CarritoManager {
    constructor() {
        this.items = JSON.parse(localStorage.getItem("carrito")) || [];
        this.descuentoActivo = 0;
    }

    agregarProducto(producto, cantidad = 1) {
        const itemExistente = this.items.find(item => item.codigo === producto.codigo);
        if (itemExistente) {
            itemExistente.cantidad += cantidad;
        } else {
            this.items.push({ ...producto, cantidad });
        }
        this.guardarCarrito();
    }

    eliminarProducto(codigo) {
        this.items = this.items.filter(item => item.codigo !== codigo);
        this.guardarCarrito();
    }

    actualizarCantidad(codigo, cantidad) {
        const item = this.items.find(item => item.codigo === codigo);
        if (item) {
            item.cantidad = cantidad;
            this.guardarCarrito();
        }
    }

    aplicarDescuento(codigo) {
        if (codigo.toLowerCase() === "pastelito10") {
            this.descuentoActivo = 5000;
            return true;
        }
        return false;
    }

    calcularTotal() {
        const subtotal = this.items.reduce((sum, item) => 
            sum + (item.precio * item.cantidad), 0);
        return subtotal - this.descuentoActivo;
    }

    guardarCarrito() {
        localStorage.setItem("carrito", JSON.stringify(this.items));
    }

    vaciarCarrito() {
        this.items = [];
        this.descuentoActivo = 0;
        localStorage.removeItem("carrito");
    }

    getItems() {
        return this.items;
    }
}