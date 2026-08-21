/* =========================================
   Organizador Kawaii — Vista genérica de asignatura
   Archivo: ./js/vistas/vistaAsignaturaGenerica.js
   Propósito: Proporcionar una vista temporal para cualquier asignatura
              que aún no tenga una implementación específica. Muestra
              las tareas de esa materia y permite agregar nuevas tareas
              a través del modal reutilizable.
   Último cambio: 2026-08-21 — Creación inicial
   ========================================= */

// ========== IMPORTACIONES ==========
import { obtenerMateriaPorRuta } from '../datos/materias.js';
import { cargarTareas, alternarTarea, eliminarTarea } from '../datos/tareas.js';
import { abrirModal } from './modalNuevaTarea.js';
import { formatearFechaCorta } from '../utilidades/fecha.js';

// ========== FUNCIONES DE RENDERIZADO ==========

/**
 * Crea un elemento de tarea para la lista de la vista genérica.
 * @param {Object} tarea - Objeto tarea.
 * @param {Object} materia - Objeto materia (para color).
 * @returns {HTMLElement} Elemento li de tarea.
 */
function crearElementoTarea(tarea, materia) {
    const li = document.createElement('li');
    li.className = 'tarea-item';
    if (tarea.completada) li.classList.add('completada');

    const checkbox = document.createElement('button');
    checkbox.className = 'checkbox' + (tarea.completada ? ' checked' : '');
    checkbox.style.borderColor = materia.color;
    checkbox.setAttribute('aria-label', 'Marcar como completada');
    checkbox.addEventListener('click', () => {
        alternarTarea(tarea.id);
        // Re-renderizar esta misma vista
        const contenedor = document.getElementById('contenido-principal');
        inicializarVistaAsignatura(contenedor, materia.ruta);
    });

    const contenido = document.createElement('div');
    contenido.className = 'contenido-tarea';

    const texto = document.createElement('span');
    texto.className = 'texto-tarea';
    texto.textContent = tarea.texto;

    const meta = document.createElement('div');
    meta.className = 'meta-tarea';
    if (tarea.fecha) {
        const fechaSpan = document.createElement('span');
        fechaSpan.className = 'fecha-tarea';
        fechaSpan.textContent = '📅 ' + formatearFechaCorta(tarea.fecha);
        meta.appendChild(fechaSpan);
    }
    if (tarea.prioridad) {
        const prioridadSpan = document.createElement('span');
        prioridadSpan.className = 'prioridad prioridad-' + tarea.prioridad;
        const etiquetas = { alta: '🔴 Alta', media: '🟡 Media', baja: '🟢 Baja' };
        prioridadSpan.textContent = etiquetas[tarea.prioridad] || tarea.prioridad;
        meta.appendChild(prioridadSpan);
    }
    contenido.appendChild(texto);
    contenido.appendChild(meta);

    const btnEliminar = document.createElement('button');
    btnEliminar.className = 'btn-eliminar';
    btnEliminar.innerHTML = '✖';
    btnEliminar.setAttribute('aria-label', 'Eliminar tarea');
    btnEliminar.addEventListener('click', () => {
        if (confirm('¿Seguro que quieres eliminar esta tarea? 🥺')) {
            eliminarTarea(tarea.id);
            const contenedor = document.getElementById('contenido-principal');
            inicializarVistaAsignatura(contenedor, materia.ruta);
        }
    });

    li.appendChild(checkbox);
    li.appendChild(contenido);
    li.appendChild(btnEliminar);
    return li;
}

/**
 * Inicializa la vista de una asignatura genérica.
 * @param {HTMLElement} contenedor - Contenedor principal.
 * @param {string} rutaMateria - Ruta de la materia (ej. 'lenguaje').
 */
export function inicializarVistaAsignatura(contenedor, rutaMateria) {
    const materia = obtenerMateriaPorRuta(rutaMateria);
    if (!materia) {
        contenedor.innerHTML = '<p>Materia no encontrada.</p>';
        return;
    }

    contenedor.innerHTML = '';

    // Título con emoji y nombre de la materia
    const titulo = document.createElement('h2');
    titulo.className = 'titulo-asignatura';
    titulo.textContent = `${materia.emoji} ${materia.nombre}`;
    contenedor.appendChild(titulo);

    // Aviso de que es una vista temporal (opcional)
    const aviso = document.createElement('p');
    aviso.className = 'sin-tareas';
    aviso.textContent = '✨ Pronto tendremos una sección especial para esta materia ✨';
    contenedor.appendChild(aviso);

    // Botón para agregar tarea usando el modal reutilizable
    const btnAgregar = document.createElement('button');
    btnAgregar.className = 'btn btn-primario';
    btnAgregar.textContent = '➕ Agregar Tarea';
    btnAgregar.addEventListener('click', () => {
        abrirModal();
        // Escuchar el evento de tarea agregada para refrescar la vista
        document.getElementById('modal-agregar-tarea').addEventListener('tarea-agregada', () => {
            inicializarVistaAsignatura(contenedor, rutaMateria);
        }, { once: true });
    });
    contenedor.appendChild(btnAgregar);

    // Lista de tareas de esta materia
    const tareas = cargarTareas().filter(t => t.materia === materia.nombre);
    const lista = document.createElement('ul');
    lista.className = 'lista-tareas';
    if (tareas.length === 0) {
        const li = document.createElement('li');
        li.className = 'sin-tareas';
        li.textContent = '✨ No hay tareas de esta materia ✨';
        lista.appendChild(li);
    } else {
        tareas.forEach(tarea => {
            lista.appendChild(crearElementoTarea(tarea, materia));
        });
    }
    contenedor.appendChild(lista);
}