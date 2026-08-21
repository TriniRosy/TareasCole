/* =========================================
   Organizador Kawaii — Vista de resumen (inicio)
   Archivo: ./js/vistas/vistaResumen.js
   Propósito: Mostrar el resumen general de tareas de todas las materias,
              con barra de progreso global, tarjetas por materia y un modal
              para agregar nuevas tareas. Es la página principal (#/inicio).
   Último cambio: 2026-08-21 — Creación inicial
   ========================================= */

// ========== IMPORTACIONES ==========
import { cargarTareas, agregarTarea, alternarTarea, eliminarTarea, limpiarCompletadas } from '../datos/tareas.js';
import { obtenerMaterias } from '../datos/materias.js';
import { formatearFechaCorta } from '../utilidades/fecha.js';

// ========== FUNCIONES DE RENDERIZADO ==========

/**
 * Genera el HTML del modal para agregar tareas.
 * El modal se oculta y muestra mediante la clase 'activo'.
 * @returns {HTMLElement} Elemento overlay del modal.
 */
function crearModalAgregar() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'modal-agregar-tarea';

    overlay.innerHTML = `
        <div class="modal">
            <button class="cerrar-modal" id="cerrar-modal">&times;</button>
            <h3>🌸 Nueva Tarea 🌸</h3>
            <form id="form-agregar-tarea">
                <div class="form-grupo">
                    <label for="input-materia">📚 Materia</label>
                    <select id="input-materia" required>
                        <option value="">-- Elige una materia --</option>
                        ${obtenerMaterias().map(m => `<option value="${m.nombre}">${m.emoji} ${m.nombre}</option>`).join('')}
                    </select>
                </div>
                <div class="form-grupo">
                    <label for="input-texto">✏️ Descripción de la tarea</label>
                    <input type="text" id="input-texto" placeholder="Ej: Hacer guía de fracciones" required>
                </div>
                <div class="form-grupo">
                    <label for="input-fecha">📅 Fecha de entrega</label>
                    <input type="date" id="input-fecha" required>
                </div>
                <div class="form-grupo">
                    <label for="input-prioridad">⚡ Prioridad</label>
                    <select id="input-prioridad">
                        <option value="alta">🔴 Alta - ¡Urgente!</option>
                        <option value="media" selected>🟡 Media - Normal</option>
                        <option value="baja">🟢 Baja - Tranquila</option>
                    </select>
                </div>
                <div class="form-botones">
                    <button type="button" class="btn btn-secundario" id="btn-cancelar">Cancelar</button>
                    <button type="submit" class="btn btn-primario">💾 Guardar Tarea</button>
                </div>
            </form>
        </div>
    `;

    // Eventos del modal
    overlay.querySelector('#cerrar-modal').addEventListener('click', () => cerrarModal(overlay));
    overlay.querySelector('#btn-cancelar').addEventListener('click', () => cerrarModal(overlay));
    overlay.addEventListener('click', (evento) => {
        if (evento.target === overlay) cerrarModal(overlay);
    });

    // Enviar formulario
    overlay.querySelector('#form-agregar-tarea').addEventListener('submit', (evento) => {
        evento.preventDefault();
        const materia = overlay.querySelector('#input-materia').value;
        const texto = overlay.querySelector('#input-texto').value.trim();
        const fecha = overlay.querySelector('#input-fecha').value;
        const prioridad = overlay.querySelector('#input-prioridad').value;

        if (!materia || !texto || !fecha) {
            alert('¡Por favor completa todos los campos! 🥺');
            return;
        }

        agregarTarea(materia, texto, fecha, prioridad);
        cerrarModal(overlay);
        // Re-renderizar la vista de resumen para reflejar la nueva tarea
        const contenedor = document.getElementById('contenido-principal');
        inicializarVistaResumen(contenedor);
    });

    return overlay;
}

/**
 * Abre el modal agregándole la clase 'activo'.
 * @param {HTMLElement} overlay - Overlay del modal.
 */
function abrirModal(overlay) {
    overlay.classList.add('activo');
}

/**
 * Cierra el modal quitándole la clase 'activo' y limpiando el formulario.
 * @param {HTMLElement} overlay - Overlay del modal.
 */
function cerrarModal(overlay) {
    overlay.classList.remove('activo');
    const formulario = overlay.querySelector('#form-agregar-tarea');
    if (formulario) formulario.reset();
    // Establecer fecha de hoy por defecto
    const inputFecha = overlay.querySelector('#input-fecha');
    if (inputFecha) {
        const hoy = new Date();
        inputFecha.value = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    }
}

/**
 * Crea la barra de progreso global con el porcentaje de tareas completadas.
 * @returns {HTMLElement} Elemento contenedor de la barra de progreso.
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
 * Crea una tarjeta para una materia con sus tareas correspondientes.
 * @param {Object} materia - Objeto de materia (nombre, emoji, color, ruta).
 * @param {Array} tareasDeMateria - Tareas que pertenecen a esa materia.
 * @returns {HTMLElement} Elemento tarjeta.
 */
function crearTarjetaMateria(materia, tareasDeMateria) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta';
    tarjeta.style.borderColor = materia.color + '55'; // Borde semitransparente
    tarjeta.style.setProperty('--color-materia', materia.color);

    // Cabecera de la tarjeta
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

    // Lista de tareas de la materia
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
 * @param {Object} materia - Materia a la que pertenece (para el color).
 * @returns {HTMLElement} Elemento li de tarea.
 */
function crearElementoTarea(tarea, materia) {
    const li = document.createElement('li');
    li.className = 'tarea-item';
    if (tarea.completada) li.classList.add('completada');

    // Checkbox circular
    const checkbox = document.createElement('button');
    checkbox.className = 'checkbox' + (tarea.completada ? ' checked' : '');
    checkbox.style.borderColor = materia.color;
    checkbox.setAttribute('aria-label', 'Marcar como completada');
    checkbox.addEventListener('click', () => {
        alternarTarea(tarea.id);
        const contenedor = document.getElementById('contenido-principal');
        inicializarVistaResumen(contenedor);
    });

    // Contenido de la tarea
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

    // Botón eliminar
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
 * Inicializa la vista de resumen dentro del contenedor principal.
 * @param {HTMLElement} contenedor - Contenedor donde se renderizará la vista.
 */
export function inicializarVistaResumen(contenedor) {
    // Limpiamos el contenedor
    contenedor.innerHTML = '';

    // Cargamos todas las tareas
    const tareas = cargarTareas();

    // Encabezado de la sección
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
        // Crear modal si no existe, o reutilizar
        let modal = document.getElementById('modal-agregar-tarea');
        if (!modal) {
            modal = crearModalAgregar();
            document.body.appendChild(modal);
        }
        abrirModal(modal);
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