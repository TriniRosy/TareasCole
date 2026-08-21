/* =========================================
   Organizador Kawaii — Datos de materias
   Archivo: ./js/datos/materias.js
   Propósito: Definir la lista de materias del 5° Básico con sus
              rutas, emojis y colores. Proporciona funciones para
              obtener las materias y buscar por ruta.
   Último cambio: 2026-08-21 — Creación inicial
   ========================================= */

// ========== LISTA DE MATERIAS ==========
// Cada materia tiene:
// - nombre: nombre completo de la asignatura
// - ruta: identificador para la navegación hash (ej. 'matematica')
// - emoji: ícono visual para mostrar en enlaces y títulos
// - color: color representativo (usado en tarjetas y etiquetas)
const MATERIAS = [
    { nombre: 'Lenguaje', ruta: 'lenguaje', emoji: '📖', color: '#ffb6c1' },
    { nombre: 'Matemática', ruta: 'matematica', emoji: '📐', color: '#a2d5f2' },
    { nombre: 'Ciencias Naturales', ruta: 'ciencias', emoji: '🔬', color: '#b5e7a0' },
    { nombre: 'Historia y Geografía', ruta: 'historia', emoji: '🌍', color: '#ffd59e' },
    { nombre: 'Inglés', ruta: 'ingles', emoji: '🇬🇧', color: '#d5b3e5' },
    { nombre: 'Artes Visuales', ruta: 'artes', emoji: '🎨', color: '#f7c6d9' },
    { nombre: 'Música', ruta: 'musica', emoji: '🎵', color: '#c9e4de' },
    { nombre: 'Ed. Física', ruta: 'edfisica', emoji: '⚽', color: '#f9e0b0' },
    { nombre: 'Tecnología', ruta: 'tecnologia', emoji: '💻', color: '#b0d4f1' },
    { nombre: 'Orientación', ruta: 'orientacion', emoji: '💬', color: '#e8d0f0' },
];

// ========== FUNCIONES DE ACCESO ==========

/**
 * Devuelve una copia de la lista de materias para evitar mutaciones accidentales.
 * @returns {Array} Copia del arreglo MATERIAS.
 */
export function obtenerMaterias() {
    // Usamos map con spread para copiar objetos simples
    return MATERIAS.map(materia => ({ ...materia }));
}

/**
 * Busca una materia por su ruta.
 * @param {string} ruta - Ruta de la materia (ej. 'matematica').
 * @returns {Object|null} Materia encontrada o null si no existe.
 */
export function obtenerMateriaPorRuta(ruta) {
    const materia = MATERIAS.find(m => m.ruta === ruta);
    return materia ? { ...materia } : null;
}