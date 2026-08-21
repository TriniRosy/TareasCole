/* =========================================
   Organizador Kawaii — Vista de resumen (inicio)
   Archivo: ./js/vistas/vistaResumen.js
   Propósito: Mostrar el resumen general de tareas de todas las materias,
              con barra de progreso global, tarjetas por materia y un botón
              para agregar tareas (usando el modal reutilizable).
   Último cambio: 2026-08-21 — Se extrajo el modal a un componente reutilizable
   ========================================= */

// ========== IMPORTACIONES ==========
import { cargarTareas, alternarTarea, eliminarTarea, limpiarCompletadas } from '../datos/tareas.js';
import { obtenerMaterias } from '../datos/materias.js';
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
 * Crea una tarjeta para una materia con sus tareas.
 * @param {Object} materia - Objeto materia.
 * @param {Array} tareasDeMateria - Tareas de esa materia.
 * @returns {HTMLElement} Elemento tarjeta.
 */
function crearTarjetaMateria(materia, tareasDeMateria) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta';
    tarjeta.style.borderColor = materia.color + '55';
    tarjeta.style.setProperty('--color-materia', materia.color);

    // Cabecera
    const cabecera = document.createElement('div');
    cabecera.className = 'cabecera-tarjeta';
    cabecera.style.display = 'flex';
    cabecera.style.alignItems = 'center';
    cabecera.style.gap = '12px';
    cabecera.style.marginBottom = '15px';

    const icono = document.createElement('span');
    icono.textContent = materia.emoji;
    icono.style.fontSize = '2rem';

    const nombre = document.createElement('span');
    nombre.className = 'nombre-materia';
    nombre.textContent = materia.nombre;
    nombre.style.fontFamily = 'var(--fuente-titulos)';
    nombre.style.fontSize = '1.3rem';
    nombre.style.fontWeight = '700';

    const contador = document.createElement('span');
    contador.className = 'contador';
    contador.textContent = `${tareasDeMateria.filter(t => t.completada).length}/${tareasDeMateria.length}`;
    contador.style.background = materia.color;
    contador.style.color = 'white';
    contador.style.padding = '4px 12px';
    contador.style.borderRadius = '30px';
    contador.style.fontSize = '0.85rem';
    contador.style.fontWeight = '700';

    cabecera.appendChild(icono);
    cabecera.appendChild(nombre);
    cabecera.appendChild(contador);
    tarjeta.appendChild(cabecera);

    // Lista de tareas
    const lista = document.createElement('ul');
    lista.className = 'lista-tareas';

    if (tareasDeMateria.length === 0) {
        const li = document.createElement('li');
        li.className = 'sin-tareas';
        li.textContent = '✨ Sin tareas pendientes ✨';
        lista.appendChild(li);
    } else {
        tareasDeMateria.forEach(tarea => {
            lista.appendChild(crearElementoTarea(tarea, materia));
        });
    }
    tarjeta.appendChild(lista);
    return tarjeta;
}

/**
 * Crea un elemento de lista para una tarea individual.
 * @param {Object} tarea - Objeto tarea.
 * @param {Object} materia - Materia correspondiente.
 * @returns {HTMLElement} Elemento li.
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
        const contenedor = document.getElementById('contenido-principal');
        inicializarVistaResumen(contenedor);
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
            inicializarVistaResumen(contenedor);
        }
    });

    li.appendChild(checkbox);
    li.appendChild(contenido);
    li.appendChild(btnEliminar);
    return li;
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
        // Escuchar el evento de tarea agregada para refrescar
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

    // Grid de materias
    const grid = document.createElement('div');
    grid.className = 'grid-materias';
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
    grid.style.gap = '25px';

    const materias = obtenerMaterias();
    materias.forEach(materia => {
        const tareasDeMateria = tareas.filter(t => t.materia === materia.nombre);
        grid.appendChild(crearTarjetaMateria(materia, tareasDeMateria));
    });

    contenedor.appendChild(grid);
}