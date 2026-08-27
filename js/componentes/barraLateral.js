/* =========================================
   Organizador Kawaii — Componente barra lateral
   Archivo: ./js/componentes/barraLateral.js
   Versión: 1.0.1
   Propósito: Generar dinámicamente la barra lateral de navegación
              con enlaces a Inicio, Horario y todas las materias.
              Incluye saludo personalizado para Trinidad.
   Último cambio: 2026-08-27 — Añadido saludo de usuario en la barra.
   ========================================= */

// ========== IMPORTACIONES ==========
import { obtenerMaterias } from '../datos/materias.js';

// ========== FUNCIONES PRIVADAS ==========

/**
 * Crea el HTML de la barra lateral con todos los enlaces.
 * @returns {HTMLElement} Elemento nav con la barra lateral.
 */
function crearBarraLateral() {
    const nav = document.createElement('nav');
    nav.className = 'barra-lateral';
    nav.id = 'barra-lateral';

    // Título de la barra
    const titulo = document.createElement('h3');
    titulo.textContent = '🌸 Menú';
    nav.appendChild(titulo);

    // Saludo personalizado
    const saludo = document.createElement('p');
    saludo.className = 'saludo-usuario';
    saludo.textContent = '✨ Trinidad Quilodrán ✨';
    nav.appendChild(saludo);

    // Enlace a Inicio
    nav.appendChild(crearEnlace('inicio', '🏠', 'Inicio', '/inicio'));

    // Enlace a Horario
    nav.appendChild(crearEnlace('horario', '📅', 'Horario', '/horario'));

    // Separador
    const separador = document.createElement('div');
    separador.className = 'separador';
    nav.appendChild(separador);

    // Enlaces de materias
    const materias = obtenerMaterias();
    materias.forEach(materia => {
        nav.appendChild(crearEnlace(materia.ruta, materia.emoji, materia.nombre, '/' + materia.ruta));
    });

    return nav;
}

/**
 * Crea un enlace individual para la barra lateral.
 * @param {string} id - Identificador único para el enlace.
 * @param {string} emoji - Emoji representativo.
 * @param {string} texto - Texto visible del enlace.
 * @param {string} ruta - Ruta hash a la que apunta (ej. '/matematica').
 * @returns {HTMLElement} Elemento <a> con clase enlace-lateral.
 */
function crearEnlace(id, emoji, texto, ruta) {
    const enlace = document.createElement('a');
    enlace.className = 'enlace-lateral';
    enlace.id = 'enlace-' + id;
    enlace.href = '#' + ruta;
    enlace.dataset.ruta = ruta;

    const spanEmoji = document.createElement('span');
    spanEmoji.className = 'emoji';
    spanEmoji.textContent = emoji;

    const spanTexto = document.createElement('span');
    spanTexto.textContent = texto;

    enlace.appendChild(spanEmoji);
    enlace.appendChild(spanTexto);

    // Evento para cerrar la barra en móvil al hacer clic
    enlace.addEventListener('click', () => {
        const contenedor = document.getElementById('barra-lateral-contenedor');
        if (contenedor && window.innerWidth <= 768) {
            contenedor.classList.remove('abierta');
            document.getElementById('fondo-oscuro').classList.remove('visible');
        }
    });

    return enlace;
}

/**
 * Actualiza el enlace activo según la ruta actual.
 * @param {string} rutaActual - Ruta activa (ej. '/matematica').
 */
function actualizarEnlaceActivo(rutaActual) {
    document.querySelectorAll('.enlace-lateral').forEach(enlace => {
        enlace.classList.remove('activo');
    });
    const enlaceActivo = document.querySelector(`.enlace-lateral[data-ruta="${rutaActual}"]`);
    if (enlaceActivo) {
        enlaceActivo.classList.add('activo');
    }
}

/**
 * Inicializa la barra lateral: la inserta en el contenedor,
 * configura el botón hamburguesa y el fondo oscuro para móvil.
 */
export function inicializarBarraLateral() {
    const contenedor = document.getElementById('barra-lateral-contenedor');
    if (!contenedor) return;

    contenedor.innerHTML = '';
    contenedor.appendChild(crearBarraLateral());

    const botonHamburguesa = document.getElementById('boton-hamburguesa');
    const fondoOscuro = document.getElementById('fondo-oscuro');

    function alternarBarra() {
        contenedor.classList.toggle('abierta');
        fondoOscuro.classList.toggle('visible');
    }

    if (botonHamburguesa) {
        botonHamburguesa.addEventListener('click', alternarBarra);
    }

    if (fondoOscuro) {
        fondoOscuro.addEventListener('click', alternarBarra);
    }

    window.addEventListener('hashchange', () => {
        const ruta = window.location.hash.replace(/^#/, '') || '/inicio';
        actualizarEnlaceActivo(ruta);
    });

    const rutaInicial = window.location.hash.replace(/^#/, '') || '/inicio';
    actualizarEnlaceActivo(rutaInicial);

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            contenedor.classList.remove('abierta');
            fondoOscuro.classList.remove('visible');
        }
    });
}