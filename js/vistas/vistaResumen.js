/* =========================================
   Organizador Kawaii — Vista de resumen (inicio)
   Archivo: ./js/vistas/vistaResumen.js
   Versión: 1.1.0
   Propósito: Mostrar el resumen general de tareas, con barra de
              progreso global, sección "Próximas entregas" y botón
              para agregar tarea. Ya no lista las tarjetas de materias.
   Último cambio: 2026-08-27 — Se eliminaron tarjetas de materias y se
              añadió sección de próximas entregas.
   ========================================= */

// ========== IMPORTACIONES ==========
import { cargarTareas, limpiarCompletadas } from '../datos/tareas.js';
import { abrirModal } from './modalNuevaTarea.js';
import { formatearFechaCorta } from '../utilidades/fecha.js';

// ========== FUNCIONES DE RENDERIZADO ==========
/**
 * Crea la barra de progreso global con el porcentaje de tareas completadas.
 * @param {Array} tareas - Lista completa de tareas.
 * @returns {HTMLElement} Contenedor de la barra de progreso.
 */
function crearBarraProgreso(tareas) {
    const total = tareas.length;
    const completadas = tareas.filter(t => t.completada).length;
    const porcentaje = total > 0 ? Math.round((completadas / total) * 100) : 0;

    const contenedor = document.createElement('div');
    contenedor.className = 'progreso-global';
    contenedor.innerHTML = `
        <span style="font-size:1.6rem;">🌸</span>
        <div class="barra">
            <div class="relleno" style="width: ${porcentaje}%;"></div>
        </div>
        <span class="porcentaje">${porcentaje}%</span>
    `;
    return contenedor;
}

/**
 * Obtiene las 3 tareas más próximas sin completar, ordenadas por fecha.
 * @param {Array} tareas - Lista completa de tareas.
 * @returns {Array} Lista de hasta 3 tareas pendientes más cercanas.
 */
function obtenerProximasEntregas(tareas) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Para comparar solo fechas

    return tareas
        .filter(t => !t.completada && t.fecha)
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
        .slice(0, 3);
}

/**
 * Crea la lista de próximas entregas.
 * @param {Array} tareas - Lista completa de tareas.
 * @returns {HTMLElement} Elemento de lista con próximas entregas.
 */
function crearProximasEntregas(tareas) {
    const proximas = obtenerProximasEntregas(tareas);
    const lista = document.createElement('ul');
    lista.className = 'proximas-entregas';

    if (proximas.length === 0) {
        const li = document.createElement('li');
        li.className = 'sin-tareas';
        li.textContent = '✨ No hay tareas pendientes con fecha ✨';
        lista.appendChild(li);
    } else {
        proximas.forEach(tarea => {
            const li = document.createElement('li');
            li.className = 'proxima-entrega-item';
            li.innerHTML = `
                <span>${tarea.emoji || ''} ${tarea.texto}</span>
                <span class="fecha-tarea">📅 ${formatearFechaCorta(tarea.fecha)}</span>
            `;
            lista.appendChild(li);
        });
    }
    return lista;
}

/**
 * Inicializa la vista de resumen dentro del contenedor principal.
 * @param {HTMLElement} contenedor - Contenedor donde se renderizará.
 */
export function inicializarVistaResumen(contenedor) {
    contenedor.innerHTML = '';

    const tareas = cargarTareas();

    // Título
    const titulo = document.createElement('h2');
    titulo.textContent = '📚 Resumen General';
    titulo.style.color = 'var(--rosa-fuerte)';
    contenedor.appendChild(titulo);

    // Barra de progreso
    contenedor.appendChild(crearBarraProgreso(tareas));

    // Sección "Próximas entregas"
    const tarjetaProximas = document.createElement('div');
    tarjetaProximas.className = 'tarjeta';
    tarjetaProximas.innerHTML = '<h3>⏰ Próximas entregas</h3>';
    tarjetaProximas.appendChild(crearProximasEntregas(tareas));
    contenedor.appendChild(tarjetaProximas);

    // Botón para agregar tarea
    const btnAgregar = document.createElement('button');
    btnAgregar.className = 'btn btn-primario';
    btnAgregar.textContent = '➕ Agregar Tarea';
    btnAgregar.addEventListener('click', () => {
        abrirModal();
        document.getElementById('modal-agregar-tarea').addEventListener('tarea-agregada', () => {
            inicializarVistaResumen(contenedor);
        }, { once: true });
    });
    contenedor.appendChild(btnAgregar);

    // Botón para limpiar completadas
    const btnLimpiar = document.createElement('button');
    btnLimpiar.className = 'btn btn-secundario';
    btnLimpiar.textContent = '🧹 Limpiar Completadas';
    btnLimpiar.style.marginLeft = '10px';
    btnLimpiar.addEventListener('click', () => {
        limpiarCompletadas();
        inicializarVistaResumen(contenedor);
    });
    contenedor.appendChild(btnLimpiar);
}