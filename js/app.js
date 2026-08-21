/* =========================================
   Organizador Kawaii — Punto de entrada
   Archivo: ./js/app.js
   Propósito: Inicializar la aplicación, configurar el enrutador,
              actualizar fecha y saludo, y cargar los enlaces de materias
              en la navegación. Este es el primer script que se ejecuta
              al cargar la página.
   Último cambio: 2026-08-21 — Creación inicial
   ========================================= */

// ========== IMPORTACIONES ==========
// Importamos las funciones y datos desde otros módulos.
// En ES6, las importaciones se realizan al inicio del archivo.
import { inicializarNavegacion, navegarA } from './navegacion.js';
import { obtenerMaterias } from './datos/materias.js';
import { formatearFechaActual } from './utilidades/fecha.js';

// ========== FUNCIONES DE INICIALIZACIÓN ==========
/**
 * Actualiza el texto de la fecha actual y el saludo según la hora del día.
 * Esta función se ejecuta al cargar la aplicación y luego cada minuto.
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
 * Genera los enlaces de navegación para cada materia.
 * Los enlaces se insertan en el elemento con id "enlaces-materias".
 * Cada enlace apunta a la ruta hash correspondiente (ej. #/matematica).
 */
function cargarEnlacesMaterias() {
    const contenedorEnlaces = document.getElementById('enlaces-materias');
    if (!contenedorEnlaces) return;

    const materias = obtenerMaterias();
    materias.forEach(materia => {
        const enlace = document.createElement('a');
        enlace.href = `#/${materia.ruta}`;
        enlace.className = 'enlace-nav';
        enlace.textContent = `${materia.emoji} ${materia.nombre}`;
        contenedorEnlaces.appendChild(enlace);
    });
}

/**
 * Función principal de inicialización.
 * Se ejecuta cuando el DOM está completamente cargado.
 */
function iniciarAplicacion() {
    // 1. Actualizar fecha y saludo
    actualizarFechaYsaludo();
    // Actualizar cada minuto por si cambia la hora
    setInterval(actualizarFechaYsaludo, 60000);

    // 2. Cargar enlaces de materias en la barra de navegación
    cargarEnlacesMaterias();

    // 3. Inicializar el sistema de navegación (enrutador por hash)
    inicializarNavegacion();

    // 4. Navegar a la ruta inicial (si no hay hash, ir a #/inicio)
    if (!window.location.hash) {
        navegarA('/inicio');
    }
}

// ========== ARRANQUE ==========
// Esperamos a que el DOM esté listo para ejecutar la aplicación.
// Usamos 'DOMContentLoaded' para asegurar que todos los elementos HTML existen.
document.addEventListener('DOMContentLoaded', iniciarAplicacion);