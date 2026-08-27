/* =========================================
   Organizador Kawaii — Vista de resumen (inicio)
   Archivo: ./js/vistas/vistaResumen.js
   Propósito: Mostrar el resumen general de tareas: barra de progreso,
              botones de acción y sección "Próximas entregas" con las
              tres tareas más próximas. Ya no muestra tarjetas de materias
              porque la barra lateral se encarga de la navegación.
   Último cambio: 2026-08-21 — Se eliminó grid de materias y se añadió
              próxima entregas.
   ========================================= */

// ========== IMPORTACIONES ==========
import { cargarTareas, alternarTarea, eliminarTarea, limpiarCompletadas } from '../datos/tareas.js';
import { formatearFechaCorta } from '../utilidades/fecha.js';
import { abrirModal } from './modalNuevaTarea.js';

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
 * Crea la sección de "Próximas entregas" con las 3 tareas más cercanas
 * que no están completadas.
 * @param {Array} tareas - Lista completa de tareas.
 * @returns {HTMLElement} Tarjeta con la lista de próximas entregas.
 */
function crearProximasEntregas(tareas) {
    // Filtramos tareas no completadas y las ordenamos por fecha ascendente
    const tareasPendientes = tareas
        .filter(t => !t.completada)
        .sort((a, b) => (a.fecha || '').localeCompare(b.fecha || ''));

    // Tomamos las tres primeras
    const proximas = tareasPendientes.slice(0, 3);

    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta';
    tarjeta.innerHTML = '<h3>⏰ Próximas entregas</h3>';

    if (proximas.length === 0) {
        tarjeta.innerHTML += '<p class="sin-tareas">✨ No tienes tareas pendientes ✨</p>';
        return tarjeta;
    }

    const lista = document.createElement('ul');
    lista.className = 'lista-tareas';
    proximas.forEach(tarea => {
        const li = document.createElement('li');
        li.className = 'tarea-item';
        li.innerHTML = `
            <div class="contenido-tarea">
                <span class="texto-tarea">${tarea.emoji || '📌'} ${tarea.texto}</span>
                <div class="meta-tarea">
                    ${tarea.fecha ? `<span class="fecha-tarea">📅 ${formatearFechaCorta(tarea.fecha)}</span>` : ''}
                    ${tarea.materia ? `<span class="prioridad" style="background:var(--rosa-claro); color:var(--rosa-fuerte);">${tarea.materia}</span>` : ''}
                </div>
            </div>
        `;
        lista.appendChild(li);
    });

    tarjeta.appendChild(lista);
    return tarjeta;
}

/**
 * Inicializa la vista de resumen.
 * @param {HTMLElement} contenedor - Contenedor principal.
 */
export function inicializarVistaResumen(contenedor) {
    contenedor.innerHTML = '';

    const tareas = cargarTareas();

    // Título
    const titulo = document.createElement('h2');
    titulo.innerHTML = '📚 Mis Tareas <span style="font-size:0.8rem; color:var(--texto-suave);">(Resumen general)</span>';
    contenedor.appendChild(titulo);

    // Barra de progreso
    contenedor.appendChild(crearBarraProgreso(tareas));

    // Botones de acción
    const contenedorBotones = document.createElement('div');
    contenedorBotones.style.display = 'flex';
    contenedorBotones.style.gap = '12px';
    contenedorBotones.style.margin = '20px 0';
    contenedorBotones.style.flexWrap = 'wrap';

    const btnAgregar = document.createElement('button');
    btnAgregar.className = 'btn btn-primario';
    btnAgregar.textContent = '➕ Agregar Tarea';
    btnAgregar.addEventListener('click', () => {
        abrirModal();
        // Escuchar el evento de tarea agregada para refrescar la vista
        document.getElementById('modal-agregar-tarea').addEventListener('tarea-agregada', () => {
            inicializarVistaResumen(contenedor);
        }, { once: true });
    });

    const btnLimpiar = document.createElement('button');
    btnLimpiar.className = 'btn btn-secundario';
    btnLimpiar.textContent = '🧹 Limpiar Completadas';
    btnLimpiar.addEventListener('click', () => {
        limpiarCompletadas();
        inicializarVistaResumen(contenedor);
    });

    contenedorBotones.appendChild(btnAgregar);
    contenedorBotones.appendChild(btnLimpiar);
    contenedor.appendChild(contenedorBotones);

    // Sección de próximas entregas
    contenedor.appendChild(crearProximasEntregas(tareas));
}