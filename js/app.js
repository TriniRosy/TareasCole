/* =========================================
   Organizador Kawaii — Punto de entrada
   Archivo: ./js/app.js
   Propósito: Inicializar la aplicación, configurar el enrutador,
              actualizar fecha y saludo, e inicializar la barra lateral.
              Este es el primer script que se ejecuta al cargar la página.
   Último cambio: 2026-08-21 — Se añadió inicialización de barra lateral
   ========================================= */

// ========== IMPORTACIONES ==========
import { inicializarNavegacion, navegarA } from './navegacion.js';
import { inicializarBarraLateral } from './componentes/barraLateral.js';
import { formatearFechaActual } from './utilidades/fecha.js';

// ========== FUNCIONES DE INICIALIZACIÓN ==========
/**
 * Actualiza el texto de la fecha actual y el saludo según la hora del día.
 * Se ejecuta al cargar la aplicación y luego cada minuto.
 */
function actualizarFechaYsaludo() {
    const fechaActual = formatearFechaActual();
    const elementoFecha = document.getElementById('fecha-actual');
    if (elementoFecha) {
        elementoFecha.textContent = '📅 ' + fechaActual;
    }

    const hora = new Date().getHours();
    let saludo = '';
    if (hora >= 6 && hora < 12) saludo = '🌅 ¡Buenos días, Trinidad!';
    else if (hora >= 12 && hora < 19) saludo = '☀️ ¡Buenas tardes, Trinidad!';
    else if (hora >= 19 && hora < 22) saludo = '🌙 ¡Buenas noches, Trinidad!';
    else saludo = '🌟 ¡Hola, Trinidad! Ya es tarde... ¡a descansar!';

    const elementoSaludo = document.getElementById('saludo');
    if (elementoSaludo) {
        elementoSaludo.textContent = saludo;
    }
}

/**
 * Función principal de inicialización.
 * Se ejecuta cuando el DOM está completamente cargado.
 */
function iniciarAplicacion() {
    // 1. Actualizar fecha y saludo
    actualizarFechaYsaludo();
    setInterval(actualizarFechaYsaludo, 60000);

    // 2. Inicializar la barra lateral (menú de navegación)
    inicializarBarraLateral();

    // 3. Inicializar el sistema de navegación (enrutador por hash)
    inicializarNavegacion();

    // 4. Navegar a la ruta inicial (si no hay hash, ir a #/inicio)
    if (!window.location.hash) {
        navegarA('/inicio');
    }
}

// ========== ARRANQUE ==========
document.addEventListener('DOMContentLoaded', iniciarAplicacion);