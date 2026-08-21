/* =========================================
   Organizador Kawaii — Utilidades de almacenamiento
   Archivo: ./js/utilidades/almacenamiento.js
   Propósito: Encapsular el uso de localStorage para guardar y
              cargar datos de forma segura. Incluye manejo de errores
              y serialización JSON.
   Último cambio: 2026-08-21 — Creación inicial
   ========================================= */

// ========== FUNCIONES DE ALMACENAMIENTO ==========

/**
 * Carga datos desde localStorage.
 * @param {string} clave - Nombre de la clave bajo la cual se guardaron los datos.
 * @returns {any} Datos parseados, o null si no existen o hay error.
 */
export function cargarDatos(clave) {
    try {
        const datos = localStorage.getItem(clave);
        return datos ? JSON.parse(datos) : null;
    } catch (error) {
        console.warn(`No se pudieron cargar los datos de "${clave}":`, error);
        return null;
    }
}

/**
 * Guarda datos en localStorage.
 * @param {string} clave - Nombre de la clave.
 * @param {any} datos - Datos a guardar (objeto, arreglo, etc.).
 */
export function guardarDatos(clave, datos) {
    try {
        localStorage.setItem(clave, JSON.stringify(datos));
    } catch (error) {
        console.warn(`No se pudieron guardar los datos en "${clave}":`, error);
    }
}

/**
 * Elimina datos de localStorage.
 * @param {string} clave - Nombre de la clave a eliminar.
 */
export function eliminarDatos(clave) {
    try {
        localStorage.removeItem(clave);
    } catch (error) {
        console.warn(`No se pudieron eliminar los datos de "${clave}":`, error);
    }
}