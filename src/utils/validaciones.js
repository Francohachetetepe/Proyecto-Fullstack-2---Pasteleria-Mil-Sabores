export function validarRun(run) {
    run = run.replace(/\s+/g, "").toUpperCase();
    if (!/^\d{7,8}[0-9K]$/.test(run)) return false;

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

export function validarCorreo(correo) {
    const regex = /^[\w._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
    return regex.test(correo);
}

export function validarPassword(password) {
    return password.length >= 6;
}

export function validarPasswordsIguales(password, confirmPassword) {
  return password === confirmPassword;
}

export function validarEdad(fechaNacimiento) {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
    }
    return edad;
}

export function validarCodigoPromo(codigo) {
    return codigo.toUpperCase() === "FELICES50";
}

export function validarCamposVacios(...campos) {
    return campos.every(campo => campo && campo.trim() !== "");
}