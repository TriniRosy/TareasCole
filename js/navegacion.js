/* =========================================
   Organizador Kawaii — Enrutador por hash
   Archivo: ./js/navegacion.js
   Propósito: Manejar la navegación entre páginas de la SPA usando
              el hash de la URL. Carga la vista correspondiente y
              actualiza el enlace activo en la barra lateral.
   Último cambio: 2026-08-21 — Se adaptó a la barra lateral y se
              añadió enlace activo para enlaces-lateral.
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
 * Actualiza el enlace activo en la barra lateral.
 * @param {string} rutaActual - Ruta activa (ej. '/matematica').
 */
function actualizarEnlaceActivo(rutaActual) {
    // Quitamos la clase 'activo' de todos los enlaces de la barra lateral
    document.querySelectorAll('.enlace-lateral').forEach(enlace => {
        enlace.classList.remove('activo');
    });

    // Buscamos el enlace cuyo href coincide con la ruta actual
    const enlaceActivo = document.querySelector(`.enlace-lateral[href="#${rutaActual}"]`);
    if (enlaceActivo) {
        enlaceActivo.classList.add('activo');
    }
}

/**
 * Determina qué vista cargar según la ruta y delega la inicialización.
 * @param {string} rutaActual - Ruta activa.
 */
function cargarVista(rutaActual) {
    const contenedor = document.getElementById(CONTENEDOR_PRINCIPAL);
    if (!contenedor) return;

    limpiarContenedor();

    if (rutaActual === '/inicio') {
        // Vista de resumen general
        inicializarVistaResumen(contenedor);
    } else if (rutaActual === '/horario') {
        // Vista del horario editable
        inicializarVistaHorario(contenedor);
    } else if (rutaActual === '/matematica') {
        // Vista específica de Matemática (piloto)
        inicializarMatematica(contenedor);
    } else {
        // Verificar si la ruta corresponde a una materia conocida
        const materias = obtenerMaterias();
        const materiaEncontrada = materias.find(m => '/' + m.ruta === rutaActual);
        if (materiaEncontrada) {
            // Vista genérica para materias sin implementación específica
            inicializarVistaAsignatura(contenedor, materiaEncontrada.ruta);
        } else {
            // Ruta desconocida, ir a inicio
            navegarA('/inicio');
        }
    }

    actualizarEnlaceActivo(rutaActual);
}

/**
 * Inicializa el sistema de navegación.
 */
export function inicializarNavegacion() {
    cargarVista(obtenerRutaActual());
    window.addEventListener('hashchange', () => {
        cargarVista(obtenerRutaActual());
    });
}