// =====================================================================
// acciones.js
// Todo el JavaScript de la página de la cafetería. Tiene 3 partes:
//   1. Botón de Accesibilidad: cambiar los colores de la página.
//   2. Leer en voz alta: la página habla cuando navegas con la tecla Tab.
//   3. Código secreto: ↑ ↑ ↓ ↓ ← → ← → B A abre el juego Pizza Legends.
// =====================================================================


// =====================================================================
// PARTE 1: BOTÓN DE ACCESIBILIDAD (cambio de colores de la página)
// =====================================================================

// Buscamos en el HTML los elementos que vamos a usar, por su id o su clase.
const boton = document.getElementById('acc-boton');   // El botón "Accesibilidad"
const panel = document.getElementById('acc-panel');   // El panel que se abre con las opciones
// Todos los botones de colores (los que tienen el atributo data-tema)
const opciones = document.querySelectorAll('.acc-opcion[data-tema]');

// Cambia los colores de la página.
// "tema" puede ser: 'normal', 'rojo-verde', 'azul-amarillo', 'contraste' o 'grises'.
function aplicarTema(tema) {
  // Pone en el <body> el atributo data-tema="...". El CSS usa ese atributo
  // para cambiar los colores (por ejemplo: body[data-tema="grises"] { ... }).
  document.body.dataset.tema = tema;

  // Guarda el tema en el navegador para que se recuerde al volver a entrar.
  localStorage.setItem('tema-color', tema);

  // Marca como "presionado" solo el botón del tema elegido.
  // aria-pressed sirve para que los lectores de pantalla sepan cuál está activo.
  opciones.forEach(function (opcion) {
    opcion.setAttribute('aria-pressed', opcion.dataset.tema === tema);
  });
}

// Al hacer clic en "Accesibilidad", se abre o se cierra el panel.
boton.addEventListener('click', function () {
  const abrir = panel.hidden;   // Si está oculto, hay que abrirlo (y al revés)
  panel.hidden = !abrir;        // Mostrar u ocultar el panel
  boton.setAttribute('aria-expanded', abrir); // Avisa si el panel está abierto
});

// A cada botón de color le decimos: "cuando te hagan clic, aplica tu tema".
opciones.forEach(function (opcion) {
  opcion.addEventListener('click', function () {
    aplicarTema(opcion.dataset.tema);
  });
});

// Si el panel está abierto y presionas Escape, se cierra
// y el foco regresa al botón "Accesibilidad".
document.addEventListener('keydown', function (evento) {
  if (evento.key === 'Escape' && !panel.hidden) {
    panel.hidden = true;
    boton.setAttribute('aria-expanded', 'false');
    boton.focus();
  }
});

// Al cargar la página, aplicamos el tema guardado.
// Si nunca se eligió uno, usamos 'normal'.
aplicarTema(localStorage.getItem('tema-color') || 'normal');


// =====================================================================
// PARTE 2: LEER EN VOZ ALTA AL NAVEGAR CON TAB
// =====================================================================

const botonVoz = document.getElementById('acc-voz'); // Botón "Leer en voz alta al usar Tab"

// ¿La voz estaba activada la última vez? (localStorage guarda texto, por eso comparamos con 'true')
let vozActiva = localStorage.getItem('voz-activa') === 'true';

// Hace que el navegador diga en voz alta el texto que le pasemos.
function hablar(texto) {
  // Si el navegador no tiene voz, o no hay texto, no hacemos nada.
  if (!('speechSynthesis' in window) || !texto) return;

  window.speechSynthesis.cancel();                    // Calla lo que estaba diciendo antes
  const mensaje = new SpeechSynthesisUtterance(texto); // Prepara el mensaje
  mensaje.lang = 'es-PE';                              // Voz en español de Perú
  window.speechSynthesis.speak(mensaje);               // ¡Habla!
}

// Limpia el texto para que suene natural al leerlo.
// Ejemplo: "[S/ 10.00]" se lee "10 soles".
// Usa "expresiones regulares" (lo que va entre / /), que sirven para buscar patrones de texto.
function limpiar(texto) {
  return texto
    .replace(/[\[\]]/g, '')                     // Quita los corchetes [ ]
    .replace(/S\/\s*(\d+)(\.00)?/g, '$1 soles') // "S/ 10.00" → "10 soles"
    .replace(/[➞→]/g, '')                        // Quita las flechas
    .replace(/\s+/g, ' ')                        // Junta los espacios y saltos de línea en uno solo
    .trim();                                     // Quita los espacios del inicio y del final
}

// Une las líneas de un grupo con una pausa (un punto).
// Ejemplo: "01\nElige" se lee "01. Elige"   (\n significa "salto de línea")
function separarLineas(texto) {
  return texto.split('\n')            // Corta el texto en líneas
    .map(function (linea) {
      return linea.trim();            // Quita espacios a cada línea
    })
    .filter(Boolean)                  // Elimina las líneas vacías
    .join('. ');                      // Las vuelve a unir con ". "
}

// Decide QUÉ debe decir la voz según el elemento que recibió el foco.
function textoDe(elemento) {
  // Por defecto: el aria-label (si tiene) o el texto visible del elemento.
  let texto = elemento.getAttribute('aria-label') || elemento.innerText || '';
  let tipo = ''; // Se dice al final, por ejemplo: "Carta, enlace"

  if (elemento.tagName === 'A') {
    tipo = 'enlace';
  } else if (elemento.tagName === 'BUTTON') {
    tipo = 'botón';
  } else if (elemento.tagName === 'INPUT') {
    // En los campos de texto se lee su <label> (por ejemplo "Correo electrónico").
    const etiqueta = document.querySelector('label[for="' + elemento.id + '"]');
    texto = etiqueta ? etiqueta.innerText : 'Campo';
    tipo = 'campo de texto';
  } else if (elemento.tagName === 'IMG') {
    // En las imágenes se lee su descripción (el atributo alt).
    texto = 'Imagen. ' + (elemento.alt || 'Sin descripción');
  } else if (elemento.tagName === 'IFRAME') {
    // En el mapa se lee su title.
    texto = elemento.title || 'Contenido incrustado';
  } else if (/^H[1-6]$/.test(elemento.tagName)) {
    // h1, h2, h3... son títulos.
    texto = 'Título. ' + texto;
  } else if (elemento.classList.contains('paso')) {
    // Los pasos de "Pedir es fácil".
    texto = 'Paso ' + separarLineas(texto);
  } else if (elemento.classList.contains('ventaja') || elemento.parentElement.classList.contains('datos')) {
    // Las ventajas y los datos de "Visítanos" (Dirección, Horario, etc.).
    texto = separarLineas(texto);
  } else if (elemento.classList.contains('chips')) {
    // Las etiquetas de cada producto ("Café", "Caliente").
    texto = 'Categorías: ' + texto.split('\n').join(', ');
  } else if (elemento.classList.contains('precio')) {
    texto = 'Precio: ' + texto;
  }

  // Devuelve el texto limpio y, si tiene, el tipo. Ejemplo: "Agregar, botón".
  return limpiar(texto) + (tipo ? ', ' + tipo : '');
}

// ---------------------------------------------------------------------
// Normalmente Tab solo se detiene en enlaces, botones y campos.
// Para que también se detenga en textos, títulos e imágenes, les ponemos
// tabindex="0". Esto solo se hace mientras la voz está activada.
// ---------------------------------------------------------------------

// Elementos que se leen JUNTOS como un bloque (por ejemplo, un paso completo).
const grupos = '.ventaja, .paso, .chips, .datos > div, .precio';
// Elementos que se leen uno por uno.
const sueltos = 'h1, h2, h3, p, li, img, iframe';
// Elementos a los que Tab YA llega solo (no hace falta tocarlos).
const interactivos = 'a, button, input, select, textarea';

// Hace que Tab pueda detenerse en todos los textos e imágenes.
function hacerLeible() {
  const candidatos = document.querySelectorAll(grupos + ', ' + sueltos);

  candidatos.forEach(function (elemento) {
    const esGrupo = elemento.matches(grupos);
    // Si está dentro de un grupo, ya se lee con el grupo: lo saltamos.
    const dentroDeGrupo = !esGrupo && elemento.closest(grupos);
    // Si tiene un enlace o botón adentro, ese enlace ya se lee: lo saltamos.
    const tieneInteractivos = elemento.querySelector(interactivos);
    // No tocamos la ventana del juego ni el panel de accesibilidad.
    const fueraDeLectura = elemento.closest('.juego-modal, .acc-panel');

    if (dentroDeGrupo || tieneInteractivos || fueraDeLectura) return; // return = pasar al siguiente
    if (elemento.hasAttribute('tabindex')) return; // Ya tenía tabindex: no lo cambiamos

    elemento.setAttribute('tabindex', '0'); // Ahora Tab se detiene aquí
    elemento.dataset.leible = 'si';         // Marca para saber que lo pusimos nosotros
  });
}

// Deshace lo anterior: quita los tabindex que pusimos (cuando se apaga la voz).
function quitarLeible() {
  document.querySelectorAll('[data-leible]').forEach(function (elemento) {
    elemento.removeAttribute('tabindex');
    delete elemento.dataset.leible;
  });
}

// Actualiza todo según si la voz está prendida o apagada.
function actualizarVoz() {
  botonVoz.setAttribute('aria-pressed', vozActiva); // Marca el botón como activo o no
  localStorage.setItem('voz-activa', vozActiva);    // Lo recuerda para la próxima visita
  if (vozActiva) {
    hacerLeible();
  } else {
    quitarLeible();
  }
}

// Al hacer clic en el botón de voz: prende o apaga la voz.
botonVoz.addEventListener('click', function () {
  vozActiva = !vozActiva; // ! invierte el valor: true → false, false → true
  actualizarVoz();
  if (vozActiva) {
    hablar('Voz activada');
  } else {
    window.speechSynthesis.cancel(); // Si se apaga, se calla de inmediato
  }
});

// 'focusin' ocurre cada vez que un elemento recibe el foco (por ejemplo, al presionar Tab).
// Si la voz está activa, leemos ese elemento.
document.addEventListener('focusin', function (evento) {
  if (vozActiva) hablar(textoDe(evento.target)); // evento.target = el elemento enfocado
});

// Al cargar la página, dejamos la voz como estaba la última vez.
actualizarVoz();


// =====================================================================
// PARTE 3: CÓDIGO SECRETO ↑ ↑ ↓ ↓ ← → ← → B A → abre el juego Pizza Legends
// =====================================================================

// Las teclas que hay que presionar, en orden.
// 'ArrowUp' = flecha arriba, 'ArrowDown' = flecha abajo, etc.
const codigoSecreto = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a'
];

// Aquí guardamos las últimas teclas que presionó el usuario.
let teclasRecientes = [];

// Elementos del HTML de la ventana del juego.
const juegoModal = document.getElementById('juego-modal');   // La ventana que tapa la página
const juegoFrame = document.getElementById('juego-frame');   // El <iframe> donde se carga el juego
const juegoCerrar = document.getElementById('juego-cerrar'); // El botón "✕ Cerrar"

// Abre el juego.
function abrirJuego() {
  juegoFrame.src = 'pizza-legends/index.html'; // Carga el juego dentro del iframe
  juegoModal.hidden = false;                   // Muestra la ventana
  document.body.style.overflow = 'hidden';     // Evita que la página de atrás haga scroll

  // Cuando el juego termine de cargar, le damos el foco
  // para que las flechas muevan al personaje.
  // { once: true } = esto se ejecuta una sola vez.
  juegoFrame.addEventListener('load', function () {
    juegoFrame.focus();
  }, { once: true });
}

// Cierra el juego.
function cerrarJuego() {
  juegoModal.hidden = true;                // Oculta la ventana
  juegoFrame.src = 'about:blank';          // Descarga el juego para que no siga corriendo
  document.body.style.overflow = '';       // Devuelve el scroll a la página
}

// El botón "✕ Cerrar" cierra el juego.
juegoCerrar.addEventListener('click', cerrarJuego);

// Cada vez que se presiona una tecla en la página...
document.addEventListener('keydown', function (evento) {
  // Si el juego está abierto, no revisamos el código secreto.
  if (!juegoModal.hidden) {
    if (evento.key === 'Escape') cerrarJuego();
    return;
  }

  // Si es una letra la pasamos a minúscula ("B" → "b") para que funcione con o sin mayúsculas.
  // Las flechas tienen nombres largos ("ArrowUp"), esas se dejan igual.
  const tecla = evento.key.length === 1 ? evento.key.toLowerCase() : evento.key;

  // Agregamos la tecla al final de la lista...
  teclasRecientes.push(tecla);
  // ...y si ya hay más de 10, quitamos la más antigua (la primera).
  if (teclasRecientes.length > codigoSecreto.length) teclasRecientes.shift();

  // Convertimos ambas listas a texto para compararlas fácilmente.
  // Si las últimas 10 teclas son iguales al código secreto, ¡abrimos el juego!
  if (teclasRecientes.join(',') === codigoSecreto.join(',')) {
    teclasRecientes = []; // Vaciamos la lista para empezar de nuevo
    abrirJuego();
  }
});
