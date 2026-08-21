/* =========================================
   Organizador Kawaii — Asignatura Matemática
   Archivo: ./js/asignaturas/matematica/matematica.js
   Propósito: Vista piloto para la asignatura de Matemática.
              Renderiza la página de la materia, lista las tareas
              de matemática, permite agregar, marcar como completada
              y eliminar tareas (usando almacenamiento global en localStorage).
              Incluye una pequeña sección de fórmulas útiles.
   Último cambio: 2026-08-21 — Creación del piloto
   ========================================= */

// ========== CONSTANTES ==========
const CLAVE_STORAGE_GLOBAL = 'tareas_globales_kawaii';
const NOMBRE_MATERIA = 'Matemática';

// ========== FUNCIONES DE ALMACENAMIENTO (temporales, luego se moverán a utilidades) ==========
function cargarTareasGlobales() {
    try {
        const datos = localStorage.getItem(CLAVE_STORAGE_GLOBAL);
        return datos ? JSON.parse(datos) : [];
    } catch (error) {
        console.warn('Error al cargar tareas globales:', error);
        return [];
    }
}

function guardarTareasGlobales(tareas) {
    try {
        localStorage.setItem(CLAVE_STORAGE_GLOBAL, JSON.stringify(tareas));
    } catch (error) {
        console.warn('Error al guardar tareas globales:', error);
    }
}

// ========== UTILIDADES DE FECHA (temporal) ==========
function formatearFecha(fechaISO) {
    if (!fechaISO) return '';
    const [anio, mes, dia] = fechaISO.split('-');
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const mesNombre = meses[parseInt(mes, 10) - 1] || mes;
    return `${dia} ${mesNombre}`;
}

function obtenerFechaHoy() {
    const ahora = new Date();
    return new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000).toISOString().split('T')[0];
}

// ========== FUNCIONES ESPECÍFICAS DE MATEMÁTICA ==========
function obtenerTareasMatematica(tareas) {
    return tareas.filter(tarea => tarea.materia === NOMBRE_MATERIA);
}

// ========== RENDERIZADO ==========
function renderizarVistaMatematica(contenedor, tareas) {
    // Limpiamos contenedor
    contenedor.innerHTML = '';

    // Título de la asignatura
    const titulo = document.createElement('h2');
    titulo.className = 'titulo-asignatura';
    titulo.innerHTML = '📐 Matemática <span style="font-size:0.8rem; color:var(--texto-suave);">5° Básico</span>';
    contenedor.appendChild(titulo);

    // Sección de fórmulas rápidas (decorativa por ahora)
    const seccionFormulas = document.createElement('div');
    seccionFormulas.className = 'tarjeta-formulas';
    seccionFormulas.innerHTML = `
        <h3>🧮 Fórmulas rápidas</h3>
        <ul>
            <li>Área del cuadrado: lado × lado</li>
            <li>Área del triángulo: (base × altura) / 2</li>
            <li>Perímetro: suma de todos los lados</li>
        </ul>
    `;
    contenedor.appendChild(seccionFormulas);

    // Contenedor de tareas
    const seccionTareas = document.createElement('div');
    seccionTareas.className = 'seccion-tareas-matematica';
    seccionTareas.innerHTML = '<h3>📝 Tareas pendientes</h3>';
    contenedor.appendChild(seccionTareas);

    // Lista de tareas de matemática
    const listaTareas = document.createElement('ul');
    listaTareas.className = 'lista-tareas';
    const tareasMatematica = obtenerTareasMatematica(tareas);
    
    if (tareasMatematica.length === 0) {
        const li = document.createElement('li');
        li.className = 'sin-tareas';
        li.textContent = '✨ No hay tareas de matemática. ¡Eres genial! ✨';
        listaTareas.appendChild(li);
    } else {
        tareasMatematica.forEach(tarea => {
            listaTareas.appendChild(crearElementoTarea(tarea));
        });
    }
    seccionTareas.appendChild(listaTareas);

    // Formulario para agregar tarea
    const formulario = document.createElement('form');
    formulario.className = 'formulario-agregar-tarea';
    formulario.innerHTML = `
        <div class="form-grupo">
            <label for="input-texto-matematica">✏️ Descripción de la tarea</label>
            <input type="text" id="input-texto-matematica" placeholder="Ej: Hacer guía de fracciones" required>
        </div>
        <div class="form-grupo">
            <label for="input-fecha-matematica">📅 Fecha de entrega</label>
            <input type="date" id="input-fecha-matematica" value="${obtenerFechaHoy()}" required>
        </div>
        <div class="form-grupo">
            <label for="input-prioridad-matematica">⚡ Prioridad</label>
            <select id="input-prioridad-matematica">
                <option value="alta">🔴 Alta - ¡Urgente!</option>
                <option value="media" selected>🟡 Media - Normal</option>
                <option value="baja">🟢 Baja - Tranquila</option>
            </select>
        </div>
        <button type="submit" class="btn btn-primario">➕ Agregar Tarea</button>
    `;
    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();
        agregarTareaDesdeFormulario(formulario, contenedor);
    });
    contenedor.appendChild(formulario);
}

function crearElementoTarea(tarea) {
    const li = document.createElement('li');
    li.className = 'tarea-item';
    li.dataset.id = tarea.id;
    if (tarea.completada) li.classList.add('completada');

    const checkbox = document.createElement('button');
    checkbox.className = 'checkbox' + (tarea.completada ? ' checked' : '');
    checkbox.setAttribute('aria-label', 'Marcar como completada');
    checkbox.addEventListener('click', () => alternarTarea(tarea.id));

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
        fechaSpan.textContent = '📅 ' + formatearFecha(tarea.fecha);
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
    btnEliminar.addEventListener('click', () => eliminarTarea(tarea.id));

    li.appendChild(checkbox);
    li.appendChild(contenido);
    li.appendChild(btnEliminar);
    return li;
}

// ========== ACCIONES ==========
function agregarTareaDesdeFormulario(formulario, contenedor) {
    const texto = formulario.querySelector('#input-texto-matematica').value.trim();
    const fecha = formulario.querySelector('#input-fecha-matematica').value;
    const prioridad = formulario.querySelector('#input-prioridad-matematica').value;

    if (!texto || !fecha) {
        alert('¡Por favor completa todos los campos! 🥺');
        return;
    }

    const tareas = cargarTareasGlobales();
    const nuevaTarea = {
        id: Date.now(),
        materia: NOMBRE_MATERIA,
        texto: texto,
        fecha: fecha,
        prioridad: prioridad,
        completada: false,
    };
    tareas.unshift(nuevaTarea);
    guardarTareasGlobales(tareas);

    // Limpiar campos del formulario
    formulario.querySelector('#input-texto-matematica').value = '';
    formulario.querySelector('#input-fecha-matematica').value = obtenerFechaHoy();
    formulario.querySelector('#input-prioridad-matematica').value = 'media';

    // Re-renderizar vista
    renderizarVistaMatematica(contenedor, tareas);
}

function alternarTarea(id) {
    const tareas = cargarTareasGlobales();
    const tareasActualizadas = tareas.map(tarea =>
        tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
    );
    guardarTareasGlobales(tareasActualizadas);
    // Re-renderizar (podríamos optimizar, pero por simplicidad)
    const contenedor = document.querySelector('.contenedor-asignatura');
    if (contenedor) renderizarVistaMatematica(contenedor, tareasActualizadas);
}

function eliminarTarea(id) {
    if (confirm('¿Seguro que quieres eliminar esta tarea? 🥺')) {
        const tareas = cargarTareasGlobales();
        const tareasActualizadas = tareas.filter(tarea => tarea.id !== id);
        guardarTareasGlobales(tareasActualizadas);
        const contenedor = document.querySelector('.contenedor-asignatura');
        if (contenedor) renderizarVistaMatematica(contenedor, tareasActualizadas);
    }
}

// ========== FUNCIÓN PRINCIPAL DE INICIALIZACIÓN ==========
export function inicializarMatematica(contenedor) {
    // Aseguramos que el contenedor tenga una clase para referencias
    contenedor.classList.add('contenedor-asignatura');
    const tareas = cargarTareasGlobales();
    renderizarVistaMatematica(contenedor, tareas);
}