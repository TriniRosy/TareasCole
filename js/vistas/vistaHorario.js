/* =========================================
   Organizador Kawaii — Vista de horario
   Archivo: ./js/vistas/vistaHorario.js
   Versión: 1.3.0
   Propósito: Mostrar el horario semanal de forma adaptativa:
              - Escritorio: tabla estilizada con colores por materia.
              - Móvil: tarjetas por día con listado de bloques.
              Soporta modo edición (selects) y enlaces directos
              a materias en modo visualización.
   Último cambio: 2026-08-30 — Renderizado adaptativo (tabla + tarjetas por día)
              y leyenda de colores.
   ========================================= */

// ========== IMPORTACIONES ==========
import { cargarHorario, guardarHorario, obtenerDias } from '../datos/horario.js';
import { obtenerMaterias } from '../datos/materias.js';

// ========== FUNCIONES AUXILIARES ==========

/**
 * Obtiene la ruta de una materia a partir de su nombre.
 * @param {string} nombreMateria - Nombre de la materia.
 * @returns {string|null} Ruta (ej. '/matematica') o null.
 */
function obtenerRutaDeMateria(nombreMateria) {
    const materias = obtenerMaterias();
    const materia = materias.find(m => m.nombre === nombreMateria);
    return materia ? '/' + materia.ruta : null;
}

/**
 * Obtiene el emoji de una materia.
 * @param {string} nombreMateria - Nombre de la materia.
 * @returns {string} Emoji representativo.
 */
function obtenerEmojiMateria(nombreMateria) {
    const materias = obtenerMaterias();
    const materia = materias.find(m => m.nombre === nombreMateria);
    return materia ? materia.emoji : '📘';
}

/**
 * Convierte el nombre de la materia a una clase CSS válida.
 * Ej: "Ciencias Naturales" => "ciencias", "Ed. Física" => "edfisica".
 * @param {string} nombreMateria - Nombre de la materia.
 * @returns {string} Clase sin espacios ni caracteres especiales.
 */
function obtenerClaseMateria(nombreMateria) {
    const mapa = {
        'Lenguaje': 'lenguaje',
        'Matemática': 'matematica',
        'Ciencias Naturales': 'ciencias',
        'Historia y Geografía': 'historia',
        'Inglés': 'ingles',
        'Artes Visuales': 'artes',
        'Música': 'musica',
        'Ed. Física': 'edfisica',
        'Tecnología': 'tecnologia',
        'Orientación': 'orientacion',
        'Recreo': 'recreo',
    };
    return mapa[nombreMateria] || 'lenguaje';
}

/**
 * Crea la leyenda de colores con las materias y el recreo.
 * @returns {HTMLElement} Elemento div con la leyenda.
 */
function crearLeyenda() {
    const leyenda = document.createElement('div');
    leyenda.className = 'leyenda';

    const materias = obtenerMaterias();
    const colores = {
        'Lenguaje': '#ffb6c1',
        'Matemática': '#a2d5f2',
        'Ciencias Naturales': '#b5e7a0',
        'Historia y Geografía': '#ffd59e',
        'Inglés': '#d5b3e5',
        'Artes Visuales': '#f7c6d9',
        'Música': '#c9e4de',
        'Ed. Física': '#f9e0b0',
        'Tecnología': '#b0d4f1',
        'Orientación': '#e8d0f0',
    };

    materias.forEach(materia => {
        const item = document.createElement('span');
        item.className = 'leyenda-item';
        const color = document.createElement('span');
        color.className = 'leyenda-color';
        color.style.backgroundColor = colores[materia.nombre] || '#cccccc';
        const texto = document.createElement('span');
        texto.textContent = materia.nombre;
        item.appendChild(color);
        item.appendChild(texto);
        leyenda.appendChild(item);
    });

    // Recreo
    const itemRecreo = document.createElement('span');
    itemRecreo.className = 'leyenda-item';
    const colorRecreo = document.createElement('span');
    colorRecreo.className = 'leyenda-color';
    colorRecreo.style.backgroundColor = '#f0f0f0';
    const textoRecreo = document.createElement('span');
    textoRecreo.textContent = 'Recreo';
    itemRecreo.appendChild(colorRecreo);
    itemRecreo.appendChild(textoRecreo);
    leyenda.appendChild(itemRecreo);

    return leyenda;
}

/**
 * Renderiza la tabla de horario para escritorio.
 * @param {Array} horario - Lista de bloques horarios.
 * @param {Array} dias - Días de la semana.
 * @param {boolean} modoEdicion - Si está en modo edición.
 * @returns {HTMLElement} Tabla HTML.
 */
function renderizarTabla(horario, dias, modoEdicion) {
    const tabla = document.createElement('table');
    tabla.className = 'tabla-horario';

    // Encabezado
    const thead = document.createElement('thead');
    const filaHead = document.createElement('tr');
    const thHora = document.createElement('th');
    thHora.textContent = 'Hora';
    filaHead.appendChild(thHora);
    dias.forEach(dia => {
        const th = document.createElement('th');
        th.textContent = dia.charAt(0).toUpperCase() + dia.slice(1);
        filaHead.appendChild(th);
    });
    thead.appendChild(filaHead);
    tabla.appendChild(thead);

    // Cuerpo
    const tbody = document.createElement('tbody');
    horario.forEach((bloque, indiceBloque) => {
        const fila = document.createElement('tr');

        // Hora
        const tdHora = document.createElement('td');
        tdHora.innerHTML = `<strong>${bloque.hora}</strong>`;
        fila.appendChild(tdHora);

        // Días
        dias.forEach(dia => {
            const td = document.createElement('td');
            const valor = bloque[dia] || 'Recreo';

            if (modoEdicion) {
                // Crear select para edición
                const select = document.createElement('select');
                select.style.width = '100%';
                select.style.padding = '6px';
                select.style.border = '3px solid var(--rosa-claro)';
                select.style.borderRadius = '12px';
                select.style.fontFamily = 'var(--fuente-cuerpo)';

                // Opción Recreo
                const opcionRecreo = document.createElement('option');
                opcionRecreo.value = 'Recreo';
                opcionRecreo.textContent = '☕ Recreo';
                select.appendChild(opcionRecreo);

                // Materias
                obtenerMaterias().forEach(materia => {
                    const opcion = document.createElement('option');
                    opcion.value = materia.nombre;
                    opcion.textContent = `${materia.emoji} ${materia.nombre}`;
                    select.appendChild(opcion);
                });

                select.value = valor;

                // Guardar cambio automáticamente
                select.addEventListener('change', () => {
                    const horarioActual = cargarHorario();
                    horarioActual[indiceBloque][dia] = select.value;
                    guardarHorario(horarioActual);
                    select.style.borderColor = 'var(--rosa-fuerte)';
                });

                td.appendChild(select);
            } else {
                // Modo visualización
                if (valor === 'Recreo') {
                    td.textContent = '☕ Recreo';
                    td.classList.add('recreo');
                } else {
                    const ruta = obtenerRutaDeMateria(valor);
                    if (ruta) {
                        const enlace = document.createElement('a');
                        enlace.href = '#' + ruta;
                        enlace.textContent = `${obtenerEmojiMateria(valor)} ${valor}`;
                        enlace.style.textDecoration = 'none';
                        enlace.style.color = 'inherit';
                        enlace.style.fontWeight = '600';
                        td.appendChild(enlace);
                    } else {
                        td.textContent = valor;
                    }
                    // Aplicar clase de color
                    td.classList.add('celda-' + obtenerClaseMateria(valor));
                }
            }
            fila.appendChild(td);
        });

        tbody.appendChild(fila);
    });

    tabla.appendChild(tbody);
    return tabla;
}

/**
 * Renderiza las tarjetas por día para móvil.
 * @param {Array} horario - Lista de bloques horarios.
 * @param {Array} dias - Días de la semana.
 * @param {boolean} modoEdicion - Si está en modo edición.
 * @returns {HTMLElement} Contenedor con tarjetas por día.
 */
function renderizarTarjetasPorDia(horario, dias, modoEdicion) {
    const contenedor = document.createElement('div');
    contenedor.className = 'contenedor-dias';

    const nombresDias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

    dias.forEach((dia, indiceDia) => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-dia';

        const titulo = document.createElement('h3');
        titulo.textContent = nombresDias[indiceDia];
        tarjeta.appendChild(titulo);

        const lista = document.createElement('ul');

        horario.forEach((bloque, indiceBloque) => {
            const li = document.createElement('li');
            const valor = bloque[dia] || 'Recreo';

            if (modoEdicion) {
                li.innerHTML = `<span class="hora">${bloque.hora}</span>`;
                const select = document.createElement('select');
                select.style.width = '100%';
                select.style.padding = '6px';
                select.style.border = '3px solid var(--rosa-claro)';
                select.style.borderRadius = '12px';
                select.style.fontFamily = 'var(--fuente-cuerpo)';

                const opcionRecreo = document.createElement('option');
                opcionRecreo.value = 'Recreo';
                opcionRecreo.textContent = '☕ Recreo';
                select.appendChild(opcionRecreo);

                obtenerMaterias().forEach(materia => {
                    const opcion = document.createElement('option');
                    opcion.value = materia.nombre;
                    opcion.textContent = `${materia.emoji} ${materia.nombre}`;
                    select.appendChild(opcion);
                });

                select.value = valor;

                select.addEventListener('change', () => {
                    const horarioActual = cargarHorario();
                    horarioActual[indiceBloque][dia] = select.value;
                    guardarHorario(horarioActual);
                    select.style.borderColor = 'var(--rosa-fuerte)';
                });

                li.appendChild(select);
            } else {
                if (valor === 'Recreo') {
                    li.className = 'recreo';
                    li.innerHTML = `<span class="hora">${bloque.hora}</span> ☕ Recreo`;
                } else {
                    const ruta = obtenerRutaDeMateria(valor);
                    if (ruta) {
                        const enlace = document.createElement('a');
                        enlace.href = '#' + ruta;
                        enlace.textContent = `${obtenerEmojiMateria(valor)} ${valor}`;
                        enlace.style.textDecoration = 'none';
                        enlace.style.color = 'inherit';
                        enlace.style.fontWeight = '600';
                        li.innerHTML = `<span class="hora">${bloque.hora}</span>`;
                        li.appendChild(enlace);
                    } else {
                        li.innerHTML = `<span class="hora">${bloque.hora}</span> ${valor}`;
                    }
                    // Aplicar clase de color
                    li.classList.add('celda-' + obtenerClaseMateria(valor));
                }
            }

            lista.appendChild(li);
        });

        tarjeta.appendChild(lista);
        contenedor.appendChild(tarjeta);
    });

    return contenedor;
}

/**
 * Inicializa la vista del horario.
 * @param {HTMLElement} contenedor - Contenedor principal.
 */
export function inicializarVistaHorario(contenedor) {
    contenedor.innerHTML = '';

    // Título
    const titulo = document.createElement('h2');
    titulo.textContent = '📅 Mi Horario Escolar';
    contenedor.appendChild(titulo);

    // Botón para alternar modo edición
    const btnEditar = document.createElement('button');
    btnEditar.className = 'btn btn-secundario';
    btnEditar.textContent = '✏️ Editar Horario';
    btnEditar.style.marginBottom = '20px';
    btnEditar.addEventListener('click', () => {
        const modoEdicion = !contenedor.dataset.modoEdicion;
        contenedor.dataset.modoEdicion = modoEdicion ? 'activo' : '';
        inicializarVistaHorario(contenedor);
    });
    contenedor.appendChild(btnEditar);

    // Cargar datos
    const horario = cargarHorario();
    const dias = obtenerDias();
    const modoEdicion = contenedor.dataset.modoEdicion === 'activo';

    // Renderizar tabla (escritorio)
    contenedor.appendChild(renderizarTabla(horario, dias, modoEdicion));

    // Renderizar tarjetas por día (móvil)
    contenedor.appendChild(renderizarTarjetasPorDia(horario, dias, modoEdicion));

    // Leyenda de colores
    contenedor.appendChild(crearLeyenda());
}