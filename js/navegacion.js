/* =========================================
   Organizador Kawaii — Enrutador por hash
   Archivo: ./js/navegacion.js
   Versión: 1.1.0
   Propósito: Manejar la navegación entre páginas de la SPA usando
              el hash de la URL. Carga la vista correspondiente según
              la ruta activa. Ya no gestiona enlaces superiores (eso lo
              hace la barra lateral).
   Último cambio: 2026-08-27 — Se eliminó actualización de enlaces superiores.
   ========================================= */

// ========== IMPORTACIONES ==========
import { inicializarMatematica } from './asignaturas/matematica/matematica.js';
import { inicializarVistaResumen } from './vistas/vistaResumen.js';
import { inicializarVistaHorario } from './vistas/vistaHorario.js';
import { inicializarVistaAsignatura } from './vistas/vistaAsignaturaGenerica.js';
import { obtenerMaterias } from './datos/materias.js';

// ========== CONSTANTES ==========
const CONTENEDOR_PRINCIPAL = 'contenido-principal';

// ========== FUNCIONES DE NAVEGACIÓN ==========
/**
 * Obtiene la ruta actual a partir del hash de la URL.
 * @returns {string} Ruta actual (ej. '/matematica').
 */
function obtenerRutaActual() {
    const hash = window.location.hash;
    if (!hash) return '/inicio';
    return hash.replace(/^#/, '') || '/inicio';
}

/**
 * Navega a una ruta específica cambiando el hash.
 * @param {string} ruta - Ruta destino.
 */
export function navegarA(ruta) {
    window.location.hash = ruta;
}

/**
 * Limpia el contenedor principal.
 */
function limpiarContenedor() {
    const contenedor = document.getElementById(CONTENEDOR_PRINCIPAL);
    if (contenedor) {
        contenedor.innerHTML = '';
    }
}

/**
 * Determina qué vista cargar según la ruta y delega la inicialización.
 * @param {string} rutaActual - Ruta activa (ej. '/matematica').
 */
function cargarVista(rutaActual) {
    const contenedor = document.getElementById(CONTENEDOR_PRINCIPAL);
    if (!contenedor) return;

    limpiarContenedor();

    if (rutaActual === '/inicio') {
        inicializarVistaResumen(contenedor);
    } else if (rutaActual === '/horario') {
        inicializarVistaHorario(contenedor);
    } else if (rutaActual === '/matematica') {
        inicializarMatematica(contenedor);
    } else {
        // Verificar si la ruta corresponde a una materia
        const materias = obtenerMaterias();
        const materiaEncontrada = materias.find(m => '/' + m.ruta === rutaActual);
        if (materiaEncontrada) {
            inicializarVistaAsignatura(contenedor, materiaEncontrada.ruta);
        } else {
            // Ruta desconocida, ir a inicio
            navegarA('/inicio');
        }
    }
}

/**
 * Inicializa el sistema de navegación.
 */
export function inicializarNavegacion() {
    // Cargar la vista inicial según el hash actual
    cargarVista(obtenerRutaActual());

    // Escuchar cambios de hash para cargar la nueva vista
    window.addEventListener('hashchange', () => {
        cargarVista(obtenerRutaActual());
    });
}