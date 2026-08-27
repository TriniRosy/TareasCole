/* =========================================
   Organizador Kawaii — Vista de horario
   Archivo: ./js/vistas/vistaHorario.js
   Versión: 1.1.0
   Propósito: Mostrar el horario semanal en formato de tabla.
              Permite editar las asignaturas de cada bloque horario.
              En modo visualización, las celdas de materias son enlaces
              directos a la vista de la materia correspondiente.
   Último cambio: 2026-08-27 — Añadidos enlaces directos a materias.
   ========================================= */

// ========== IMPORTACIONES ==========
import { cargarHorario, guardarHorario, obtenerDias } from '../datos/horario.js';
import { obtenerMaterias } from '../datos/materias.js';

// ========== FUNCIONES AUXILIARES ==========
/**
 * Devuelve la ruta de una materia a partir de su nombre.
 * @param {string} nombreMateria - Nombre de la materia (ej. 'Matemática').
 * @returns {string|null} Ruta de la materia o null si no se encuentra.
 */
function obtenerRutaDeMateria(nombreMateria) {
    const materias = obtenerMaterias();
    const materia = materias.find(m => m.nombre === nombreMateria);
    return materia ? '/' + materia.ruta : null;
}

/**
 * Inicializa la vista del horario dentro del contenedor.
 * @param {HTMLElement} contenedor - Contenedor donde se renderizará.
 */
export function inicializarVistaHorario(contenedor) {
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
        const modoEdicion = !contenedor.dataset.modoEdicion;
        contenedor.dataset.modoEdicion = modoEdicion ? 'activo' : '';
        inicializarVistaHorario(contenedor);
    });
    contenedor.appendChild(btnEditar);

    // Cargar datos
    const horario = cargarHorario();
    const dias = obtenerDias();
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
            const valorAsignatura = bloque[dia] || 'Recreo';

            if (modoEdicion) {
                // Modo edición: select con opciones de materias
                const select = document.createElement('select');
                select.style.width = '100%';
                select.style.padding = '8px';
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

                select.value = valorAsignatura === 'Recreo' ? 'Recreo' : valorAsignatura;

                select.addEventListener('change', () => {
                    const horarioActual = cargarHorario();
                    horarioActual[indiceBloque][dia] = select.value;
                    guardarHorario(horarioActual);
                    select.style.borderColor = 'var(--rosa-fuerte)';
                });

                td.appendChild(select);
            } else {
                // Modo visualización: mostrar texto o enlace
                if (valorAsignatura === 'Recreo') {
                    td.textContent = '☕ Recreo';
                    td.classList.add('recreo');
                } else {
                    const rutaMateria = obtenerRutaDeMateria(valorAsignatura);
                    if (rutaMateria) {
                        // Crear enlace directo a la materia
                        const enlace = document.createElement('a');
                        enlace.href = '#' + rutaMateria;
                        enlace.textContent = valorAsignatura;
                        enlace.style.textDecoration = 'none';
                        enlace.style.color = 'inherit';
                        enlace.style.fontWeight = '600';
                        enlace.addEventListener('click', () => {
                            // No es necesario más, el hash hará la navegación
                        });
                        td.appendChild(enlace);
                    } else {
                        td.textContent = valorAsignatura;
                    }
                    // Aplicar clase según materia para color
                    const clase = 'mat-' + valorAsignatura.toLowerCase().replace(/\s+/g, '');
                    td.classList.add(clase);
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