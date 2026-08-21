/* =========================================
   Organizador Kawaii — Enrutador por hash
   Archivo: ./js/navegacion.js
   Propósito: Manejar la navegación entre páginas de la SPA usando
              el hash de la URL (ej. #/inicio, #/matematica).
              Se encarga de mostrar/ocultar el contenido según la ruta
              activa y de cargar las vistas correspondientes.
   Último cambio: 2026-08-21 — Creación inicial
   ========================================= */

// ========== IMPORTACIONES ==========
import { inicializarMatematica } from './asignaturas/matematica/matematica.js';
import { inicializarVistaResumen } from './vistas/vistaResumen.js';
import { inicializarVistaHorario } from './vistas/vistaHorario.js';

// ========== CONSTANTES ==========
// Contenedor principal donde se renderizan las vistas
const CONTENEDOR_PRINCIPAL = 'contenido-principal';

// ========== FUNCIONES DE NAVEGACIÓN ==========
/**
 * Obtiene la ruta actual a partir del hash de la URL.
 * Si no hay hash, devuelve '/inicio' como ruta por defecto.
 * @returns {string} Ruta actual (ej. '/matematica')
 */
function obtenerRutaActual() {
    const hash = window.location.hash;
    if (!hash) return '/inicio';
    // Eliminamos el símbolo '#' y cualquier barra inicial adicional
    return hash.replace(/^#/, '') || '/inicio';
}

/**
 * Navega a una ruta específica cambiando el hash de la URL.
 * Esto dispara el evento 'hashchange' que actualiza la vista.
 * @param {string} ruta - Ruta destino (ej. '/matematica')
 */
export function navegarA(ruta) {
    window.location.hash = ruta;
}

/**
 * Limpia el contenedor principal para preparar la nueva vista.
 */
function limpiarContenedor() {
    const contenedor = document.getElementById(CONTENEDOR_PRINCIPAL);
    if (contenedor) {
        contenedor.innerHTML = '';
    }
}

/**
 * Marca como activo el enlace de navegación correspondiente a la ruta actual.
 * Esto permite resaltar visualmente la página donde nos encontramos.
 * @param {string} rutaActual - Ruta activa (ej. '/matematica')
 */
function actualizarEnlaceActivo(rutaActual) {
    // Quitamos la clase 'activo' de todos los enlaces
    document.querySelectorAll('.enlace-nav').forEach(enlace => {
        enlace.classList.remove('activo');
    });

    // Buscamos el enlace cuyo href coincide con la ruta actual
    const enlaceActivo = document.querySelector(`.enlace-nav[href="#${rutaActual}"]`);
    if (enlaceActivo) {
        enlaceActivo.classList.add('activo');
    }
}

/**
 * Determina qué vista cargar según la ruta y delega la inicialización.
 * @param {string} rutaActual - Ruta activa (ej. '/matematica')
 */
function cargarVista(rutaActual) {
    const contenedor = document.getElementById(CONTENEDOR_PRINCIPAL);
    if (!contenedor) return;

    // Limpiamos el contenido anterior
    limpiarContenedor();

    // Dependiendo de la ruta, llamamos a la función de inicialización correspondiente
    if (rutaActual.startsWith('/matematica')) {
        // Vista de Matemática (piloto)
        inicializarMatematica(contenedor);
    } else if (rutaActual === '/horario') {
        // Vista del horario editable
        inicializarVistaHorario(contenedor);
    } else {
        // Vista de inicio (resumen)
        inicializarVistaResumen(contenedor);
    }

    // Actualizamos el enlace activo en la navegación
    actualizarEnlaceActivo(rutaActual);
}

/**
 * Inicializa el sistema de navegación.
 * Escucha los cambios de hash y carga la vista correspondiente.
 */
export function inicializarNavegacion() {
    // Cargar la vista inicial según el hash actual
    cargarVista(obtenerRutaActual());

    // Escuchar cambios en el hash (cuando el usuario navega manualmente)
    window.addEventListener('hashchange', () => {
        cargarVista(obtenerRutaActual());
    });
}