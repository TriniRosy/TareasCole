/* =========================================
   Organizador Kawaii — Datos del horario
   Archivo: ./js/datos/horario.js
   Propósito: Definir la estructura del horario semanal y gestionar
              su almacenamiento en localStorage. Permite cargar,
              guardar y obtener el horario para la vista editable.
   Último cambio: 2026-08-21 — Creación inicial
   ========================================= */

// ========== IMPORTACIONES ==========
import { cargarDatos, guardarDatos } from '../utilidades/almacenamiento.js';

// ========== CONSTANTES ==========
// Clave para guardar el horario en localStorage
const CLAVE_HORARIO = 'horario_kawaii';

// Días de la semana (orden de columnas)
const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];

// ========== HORARIO POR DEFECTO ==========
// Estructura: arreglo de bloques horarios.
// Cada bloque tiene una hora (texto) y las asignaturas por día.
// Se incluyen los recreos como bloques especiales con asignatura "Recreo".
const HORARIO_DEFECTO = [
    {
        hora: '8:00 - 8:45',
        lunes: 'Lenguaje',
        martes: 'Matemática',
        miercoles: 'Lenguaje',
        jueves: 'Matemática',
        viernes: 'Inglés',
    },
    {
        hora: '8:45 - 9:30',
        lunes: 'Matemática',
        martes: 'Lenguaje',
        miercoles: 'Inglés',
        jueves: 'Ciencias Naturales',
        viernes: 'Lenguaje',
    },
    {
        hora: 'Recreo',
        lunes: 'Recreo',
        martes: 'Recreo',
        miercoles: 'Recreo',
        jueves: 'Recreo',
        viernes: 'Recreo',
    },
    {
        hora: '9:45 - 10:30',
        lunes: 'Ciencias Naturales',
        martes: 'Ed. Física',
        miercoles: 'Matemática',
        jueves: 'Lenguaje',
        viernes: 'Matemática',
    },
    {
        hora: '10:30 - 11:15',
        lunes: 'Historia y Geografía',
        martes: 'Música',
        miercoles: 'Historia y Geografía',
        jueves: 'Ed. Física',
        viernes: 'Ciencias Naturales',
    },
    {
        hora: 'Recreo',
        lunes: 'Recreo',
        martes: 'Recreo',
        miercoles: 'Recreo',
        jueves: 'Recreo',
        viernes: 'Recreo',
    },
    {
        hora: '11:30 - 12:15',
        lunes: 'Inglés',
        martes: 'Ciencias Naturales',
        miercoles: 'Artes Visuales',
        jueves: 'Historia y Geografía',
        viernes: 'Tecnología',
    },
    {
        hora: '12:15 - 13:00',
        lunes: 'Artes Visuales',
        martes: 'Tecnología',
        miercoles: 'Orientación',
        jueves: 'Música',
        viernes: 'Artes Visuales',
    },
];

// ========== FUNCIONES DE ACCESO ==========

/**
 * Carga el horario desde localStorage.
 * Si no hay horario guardado, devuelve el horario por defecto.
 * @returns {Array} Lista de bloques horarios.
 */
export function cargarHorario() {
    const horarioGuardado = cargarDatos(CLAVE_HORARIO);
    if (horarioGuardado && Array.isArray(horarioGuardado)) {
        return horarioGuardado;
    }
    // Si no existe, guardamos el horario por defecto para futuras ediciones
    guardarDatos(CLAVE_HORARIO, HORARIO_DEFECTO);
    return [...HORARIO_DEFECTO];
}

/**
 * Guarda el horario completo en localStorage.
 * @param {Array} horario - Lista de bloques horarios a guardar.
 */
export function guardarHorario(horario) {
    guardarDatos(CLAVE_HORARIO, horario);
}

/**
 * Devuelve la lista de días de la semana.
 * Útil para generar encabezados de tabla.
 * @returns {Array} Arreglo con los días.
 */
export function obtenerDias() {
    return [...DIAS];
}