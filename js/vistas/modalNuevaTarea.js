/* =========================================
   Organizador Kawaii — Modal para agregar tarea
   Archivo: ./js/vistas/modalNuevaTarea.js
   Propósito: Componente reutilizable que muestra un modal para
              añadir una nueva tarea. Se puede usar desde cualquier
              vista (resumen, asignaturas, etc.). Encapsula la lógica
              de apertura, cierre y envío del formulario.
   Último cambio: 2026-08-21 — Creación inicial
   ========================================= */

// ========== IMPORTACIONES ==========
import { obtenerMaterias } from '../datos/materias.js';
import { agregarTarea } from '../datos/tareas.js';

// ========== FUNCIONES PRIVADAS ==========

/**
 * Crea la estructura del modal y retorna el overlay.
 * El modal no se muestra hasta que se llame a abrirModal.
 * @returns {HTMLElement} Overlay del modal listo para usar.
 */
function crearModal() {
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

    // Eventos para cerrar el modal
    overlay.querySelector('#cerrar-modal').addEventListener('click', () => cerrarModal(overlay));
    overlay.querySelector('#btn-cancelar').addEventListener('click', () => cerrarModal(overlay));
    overlay.addEventListener('click', (evento) => {
        if (evento.target === overlay) cerrarModal(overlay);
    });

    // Evento de envío del formulario
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
        // Disparamos un evento personalizado para que la vista que abrió el modal pueda refrescarse
        overlay.dispatchEvent(new CustomEvent('tarea-agregada'));
    });

    return overlay;
}

/**
 * Abre el modal y lo agrega al DOM si no existe.
 * Si ya existe, simplemente lo muestra y resetea el formulario.
 */
export function abrirModal() {
    let overlay = document.getElementById('modal-agregar-tarea');
    if (!overlay) {
        overlay = crearModal();
        document.body.appendChild(overlay);
    }
    // Resetear formulario y establecer fecha de hoy
    const formulario = overlay.querySelector('#form-agregar-tarea');
    if (formulario) formulario.reset();
    const inputFecha = overlay.querySelector('#input-fecha');
    if (inputFecha) {
        const hoy = new Date();
        inputFecha.value = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    }
    overlay.classList.add('activo');
}

/**
 * Cierra el modal (si existe).
 */
export function cerrarModal() {
    const overlay = document.getElementById('modal-agregar-tarea');
    if (overlay) {
        overlay.classList.remove('activo');
    }
}