/* =========================================
   Organizador Kawaii — Enrutador por hash
   Archivo: ./js/navegacion.js
   Versión: 1.2.0
   Propósito: Manejar la navegación entre páginas de la SPA usando
              el hash de la URL. Carga la vista correspondiente según
              la ruta activa. Además, actualiza el título del header
              con un texto contextual (Inicio, Horario o materia).
   Último cambio: 2026-08-27 — Se añadió actualización del título del header.
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
 * Actualiza el título del header según la ruta actual.
 * En inicio muestra el nombre de la aplicación; en otras rutas
 * muestra el nombre de la sección o materia correspondiente.
 * @param {string} rutaActual - Ruta activa (ej. '/matematica').
 */
function actualizarTituloHeader(rutaActual) {
    const tituloElemento = document.querySelector('.barra-superior .titulo-app');
    if (!tituloElemento) return;

    let titulo = '🌸 Organizador Kawaii 🌸'; // Valor por defecto (inicio)

    if (rutaActual === '/horario') {
        titulo = '📅 Mi Horario';
    } else if (rutaActual === '/matematica') {
        titulo = '📐 Matemática';
    } else if (rutaActual !== '/inicio') {
        // Buscar la materia correspondiente a la ruta
        const materias = obtenerMaterias();
        const materia = materias.find(m => '/' + m.ruta === rutaActual);
        if (materia) {
            titulo = `${materia.emoji} ${materia.nombre}`;
        }
    }

    tituloElemento.textContent = titulo;
}

/**
 * Determina qué vista cargar según la ruta y delega la inicialización.
 * @param {string} rutaActual - Ruta activa (ej. '/matematica').
 */
function cargarVista(rutaActual) {
    const contenedor = document.getElementById(CONTENEDOR_PRINCIPAL);
    if (!contenedor) return;

    limpiarContenedor();
    actualizarTituloHeader(rutaActual); // Actualizamos el título del header

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