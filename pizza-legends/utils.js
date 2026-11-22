// =====================================================================
// utils.js
// Funciones de ayuda que usan los demás archivos del juego.
// El mapa del juego está dividido en una cuadrícula de casillas de 16 x 16 píxeles.
// =====================================================================

const utils = {
    // Convierte un número de casillas a píxeles.
    // Ejemplo: withGrid(5) → 80 píxeles (5 casillas × 16).
    withGrid(n) {
        return n * 16;
    },

    // Convierte una casilla (x, y) en un texto tipo "80,96".
    // Se usa como "nombre" de cada casilla para guardar paredes y zonas especiales.
    // (Las comillas invertidas ` ` permiten meter variables dentro con ${...})
    asGridCoord(x,y) {
        return `${x*16},${y*16}`
    },

    // Calcula a qué posición llegaría alguien si da un paso en una dirección.
    // Se usa para saber si hay una pared ANTES de moverse.
    nextPosition(initialX, initialY, direction) {
        let x = initialX;
        let y = initialY;
        const size = 16; // Un paso = una casilla = 16 píxeles
        if (direction === "left" ){
            x -= size;   // Izquierda: x disminuye
        } else if (direction === "right"){
            x += size;   // Derecha: x aumenta
        } else if (direction === "up") {
            y -= size;   // Arriba: y disminuye (en pantalla, y crece hacia abajo)
        } else if (direction === "down") {
            y += size;   // Abajo: y aumenta
        }
        return{x,y};     // Devuelve la nueva posición
    },

    // Lanza un "aviso" (evento) a todo el documento, por ejemplo "alguien terminó de caminar".
    // Otros archivos pueden escuchar ese aviso con addEventListener.
    // name = nombre del aviso, detail = datos extra (por ejemplo, quién fue).
     emitEvent(name, detail) {
        const event = new CustomEvent(name, { detail });
        document.dispatchEvent(event);
    }
}
