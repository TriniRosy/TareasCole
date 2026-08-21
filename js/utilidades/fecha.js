/* =========================================
   Organizador Kawaii — Utilidades de fecha
   Archivo: ./js/utilidades/fecha.js
   Propósito: Funciones para formatear fechas en español (Chile).
              Incluye obtención de fecha actual, fecha corta para formularios
              y formateo de fechas ISO para mostrar en las tareas.
   Último cambio: 2026-08-21 — Creación inicial
   ========================================= */

// ========== FUNCIONES DE FECHA ==========

/**
 * Devuelve la fecha actual en formato largo, por ejemplo:
 * "jueves, 21 de agosto de 2026"
 * Se usa para mostrar la fecha en el encabezado.
 * @returns {string} Fecha actual formateada en español.
 */
export function formatearFechaActual() {
    const ahora = new Date();
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return ahora.toLocaleDateString('es-CL', opciones);
}

/**
 * Convierte una fecha en formato ISO (YYYY-MM-DD) a formato corto
 * en español, por ejemplo: "21 Ago".
 * Útil para mostrar fechas de entrega en las tarjetas de tareas.
 * @param {string} fechaISO - Fecha en formato ISO (YYYY-MM-DD)
 * @returns {string} Fecha formateada como "DD Mes"
 */
export function formatearFechaCorta(fechaISO) {
    if (!fechaISO) return '';
    const [anio, mes, dia] = fechaISO.split('-');
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const mesNombre = meses[parseInt(mes, 10) - 1] || mes;
    return `${dia} ${mesNombre}`;
}

/**
 * Obtiene la fecha de hoy en formato ISO (YYYY-MM-DD).
 * Se usa para prellenar los campos de fecha en formularios.
 * @returns {string} Fecha actual en formato YYYY-MM-DD
 */
export function obtenerFechaHoy() {
    const ahora = new Date();
    // Ajustamos la zona horaria para evitar desfase de un día
    return new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0];
}