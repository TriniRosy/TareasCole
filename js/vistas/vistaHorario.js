/* =========================================
   Organizador Kawaii — Vista de horario
   Archivo: ./js/vistas/vistaHorario.js
   Propósito: Mostrar el horario semanal en formato de tabla.
              Permite editar las asignaturas de cada bloque horario
              mediante un modo edición con selects.
   Último cambio: 2026-08-21 — Creación inicial
   ========================================= */

// ========== IMPORTACIONES ==========
import { cargarHorario, guardarHorario, obtenerDias } from '../datos/horario.js';
import { obtenerMaterias } from '../datos/materias.js';

// ========== FUNCIONES DE RENDERIZADO ==========

/**
 * Inicializa la vista del horario dentro del contenedor.
 * @param {HTMLElement} contenedor - Contenedor donde se renderizará.
 */
export function inicializarVistaHorario(contenedor) {
    // Limpiamos el contenedor
    contenedor.innerHTML = '';

    // Título
    const titulo = document.createElement('h2');
    titulo.textContent = '📅 Mi Horario Escolar (Editable)';
    contenedor.appendChild(titulo);

    // Botón para alternar modo edición
    const btnEditar = document.createElement('button');
    btnEditar.className = 'btn btn-secundario';
    btnEditar.textContent = '✏️ Editar Horario';
    btnEditar.style.marginBottom = '20px';
    btnEditar.addEventListener('click', () => {
        // Alternar variable global de modo edición
        const modoEdicion = !contenedor.dataset.modoEdicion;
        contenedor.dataset.modoEdicion = modoEdicion ? 'activo' : '';
        inicializarVistaHorario(contenedor); // Re-renderizar
    });
    contenedor.appendChild(btnEditar);

    // Cargar horario y días
    const horario = cargarHorario();
    const dias = obtenerDias();

    // Determinar si estamos en modo edición
    const modoEdicion = contenedor.dataset.modoEdicion === 'activo';

    // Crear tabla
    const tablaWrapper = document.createElement('div');
    tablaWrapper.className = 'horario-wrapper';
    const tabla = document.createElement('table');
    tabla.style.width = '100%';
    tabla.style.borderCollapse = 'separate';
    tabla.style.borderSpacing = '4px';

    // Encabezado de la tabla (días)
    const thead = document.createElement('thead');
    const filaEncabezado = document.createElement('tr');
    const thHora = document.createElement('th');
    thHora.textContent = 'Hora';
    filaEncabezado.appendChild(thHora);

    dias.forEach(dia => {
        const thDia = document.createElement('th');
        thDia.textContent = dia.charAt(0).toUpperCase() + dia.slice(1);
        filaEncabezado.appendChild(thDia);
    });
    thead.appendChild(filaEncabezado);
    tabla.appendChild(thead);

    // Cuerpo de la tabla (bloques horarios)
    const tbody = document.createElement('tbody');
    horario.forEach((bloque, indiceBloque) => {
        const fila = document.createElement('tr');

        // Columna de hora
        const tdHora = document.createElement('td');
        tdHora.textContent = bloque.hora;
        tdHora.style.fontWeight = '600';
        fila.appendChild(tdHora);

        // Columnas por día
        dias.forEach(dia => {
            const td = document.createElement('td');
            if (modoEdicion) {
                // Modo edición: select con opciones de materias
                const select = document.createElement('select');
                select.style.width = '100%';
                select.style.padding = '8px';
                select.style.border = '3px solid var(--rosa-claro)';
                select.style.borderRadius = '12px';
                select.style.fontFamily = 'var(--fuente-cuerpo)';

                // Opción para recreo
                const opcionRecreo = document.createElement('option');
                opcionRecreo.value = 'Recreo';
                opcionRecreo.textContent = '☕ Recreo';
                select.appendChild(opcionRecreo);

                // Opciones de materias
                obtenerMaterias().forEach(materia => {
                    const opcion = document.createElement('option');
                    opcion.value = materia.nombre;
                    opcion.textContent = `${materia.emoji} ${materia.nombre}`;
                    select.appendChild(opcion);
                });

                // Seleccionar el valor actual
                select.value = bloque[dia] || 'Recreo';

                // Evento change: actualizar horario y guardar
                select.addEventListener('change', () => {
                    const horarioActual = cargarHorario();
                    horarioActual[indiceBloque][dia] = select.value;
                    guardarHorario(horarioActual);
                    // Opcional: mostrar retroalimentación visual
                    select.style.borderColor = 'var(--rosa-fuerte)';
                });

                td.appendChild(select);
            } else {
                // Modo visualización: texto simple
                td.textContent = bloque[dia] || 'Recreo';
                // Aplicar clase según materia para color
                if (bloque[dia] && bloque[dia] !== 'Recreo') {
                    td.classList.add('mat-' + bloque[dia].toLowerCase().replace(/\s+/g, ''));
                } else if (bloque[dia] === 'Recreo') {
                    td.classList.add('recreo');
                }
            }
            fila.appendChild(td);
        });
        tbody.appendChild(fila);
    });
    tabla.appendChild(tbody);
    tablaWrapper.appendChild(tabla);
    contenedor.appendChild(tablaWrapper);
}