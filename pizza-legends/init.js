// =====================================================================
// init.js
// Arranca el juego. Es el ÚLTIMO archivo que se carga en index.html,
// porque necesita que todas las clases anteriores ya existan.
// =====================================================================

// (function () { ... })(); es una función que se ejecuta sola, apenas se lee.
// Sirve para que las variables de aquí adentro no se mezclen con las de otros archivos.
(function () {

  // Creamos el juego y le decimos en qué parte del HTML debe dibujarse.
  const overworld = new Overworld({
    element: document.querySelector(".game-container")
  });

  // ¡Empieza el juego!
  overworld.init();

})();
