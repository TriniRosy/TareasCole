/* =========================================
   Organizador Kawaii — Datos de tareas
   Archivo: ./js/datos/tareas.js
   Propósito: Gestionar el CRUD (crear, leer, actualizar, eliminar)
              de las tareas escolares. Usa almacenamiento global en
              localStorage y proporciona funciones para que las vistas
              interactúen con los datos sin conocer el almacenamiento.
   Último cambio: 2026-08-21 — Creación inicial
   ========================================= */

// ========== IMPORTACIONES ==========
import { cargarDatos, guardarDatos } from '../utilidades/almacenamiento.js';

// ========== CONSTANTES ==========
// Clave utilizada para guardar todas las tareas en localStorage
const CLAVE_TAREAS = 'tareas_globales_kawaii';

// ========== DATOS DE EJEMPLO ==========
// Se usan solo la primera vez, si no hay tareas guardadas.
// Así la aplicación no se ve vacía al abrirla por primera vez.
const TAREAS_EJEMPLO = [
    {
        id: 1,
        materia: 'Matemática',
        texto: 'Terminar guía de fracciones',
        fecha: '2026-08-18',
        prioridad: 'alta',
        completada: false,
    },
    {
        id: 2,
        materia: 'Lenguaje',
        texto: 'Leer capítulo 5 del libro "Papelucho"',
        fecha: '2026-08-17',
        prioridad: 'media',
        completada: false,
    },
    {
        id: 3,
        materia: 'Ciencias Naturales',
        texto: 'Preparar exposición sobre las plantas',
        fecha: '2026-08-20',
        prioridad: 'alta',
        completada: false,
    },
    {
        id: 4,
        materia: 'Inglés',
        texto: 'Practicar vocabulario de la unidad 3',
        fecha: '2026-08-16',
        prioridad: 'baja',
        completada: true,
    },
    {
        id: 5,
        materia: 'Historia y Geografía',
        texto: 'Completar mapa de Chile',
        fecha: '2026-08-19',
        prioridad: 'media',
        completada: false,
    },
    {
        id: 6,
        materia: 'Artes Visuales',
        texto: 'Traer materiales para collage',
        fecha: '2026-08-22',
        prioridad: 'baja',
        completada: false,
    },
];

// ========== FUNCIONES DE GESTIÓN ==========

/**
 * Carga todas las tareas desde localStorage.
 * Si no hay datos guardados, devuelve las tareas de ejemplo.
 * @returns {Array} Lista de tareas.
 */
export function cargarTareas() {
    const tareasGuardadas = cargarDatos(CLAVE_TAREAS);
    if (tareasGuardadas && Array.isArray(tareasGuardadas)) {
        return tareasGuardadas;
    }
    // Si no hay tareas, guardamos las de ejemplo y las devolvemos
    guardarDatos(CLAVE_TAREAS, TAREAS_EJEMPLO);
    return [...TAREAS_EJEMPLO];
}

/**
 * Guarda todas las tareas en localStorage.
 * @param {Array} tareas - Lista completa de tareas.
 */
export function guardarTareas(tareas) {
    guardarDatos(CLAVE_TAREAS, tareas);
}

/**
 * Agrega una nueva tarea al inicio de la lista y guarda.
 * @param {string} materia - Nombre de la materia.
 * @param {string} texto - Descripción de la tarea.
 * @param {string} fecha - Fecha de entrega (YYYY-MM-DD).
 * @param {string} prioridad - Prioridad: 'alta', 'media' o 'baja'.
 * @returns {Array} Lista actualizada de tareas.
 */
export function agregarTarea(materia, texto, fecha, prioridad) {
    const tareas = cargarTareas();
    const nuevaTarea = {
        id: Date.now(), // Usamos timestamp como identificador único
        materia,
        texto,
        fecha,
        prioridad: prioridad || 'media',
        completada: false,
    };
    tareas.unshift(nuevaTarea); // La más reciente al principio
    guardarTareas(tareas);
    return tareas;
}

/**
 * Alterna el estado completada/no completada de una tarea.
 * @param {number} id - Identificador de la tarea.
 * @returns {Array} Lista actualizada de tareas.
 */
export function alternarTarea(id) {
    const tareas = cargarTareas();
    const tareasActualizadas = tareas.map(tarea =>
        tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
    );
    guardarTareas(tareasActualizadas);
    return tareasActualizadas;
}

/**
 * Elimina una tarea por su id.
 * @param {number} id - Identificador de la tarea.
 * @returns {Array} Lista actualizada de tareas.
 */
export function eliminarTarea(id) {
    const tareas = cargarTareas();
    const tareasActualizadas = tareas.filter(tarea => tarea.id !== id);
    guardarTareas(tareasActualizadas);
    return tareasActualizadas;
}

/**
 * Elimina todas las tareas completadas.
 * @returns {Array} Lista actualizada de tareas (solo pendientes).
 */
export function limpiarCompletadas() {
    const tareas = cargarTareas();
    const tareasPendientes = tareas.filter(tarea => !tarea.completada);
    guardarTareas(tareasPendientes);
    return tareasPendientes;
}