// =====================================================================
// DirectionInput.js
// Lee el teclado: sabe qué flecha (o tecla W A S D) está presionando el jugador.
// =====================================================================

class DirectionInput {
    constructor() {
        // Lista de direcciones que se están presionando AHORA.
        // La primera de la lista es la más reciente.
        this.heldDirections = [];

        // "Traductor" de tecla a dirección.
        // e.code da el nombre de la tecla física: "ArrowUp", "KeyW", etc.
        this.map = {
            "ArrowUp" : "up",
            "KeyW" : "up",
            "ArrowDown" : "down",
            "KeyS" : "down",
            "ArrowLeft" : "left",
            "KeyA" : "left",
            "ArrowRight" : "right",
            "KeyD" : "right",
        }
    }

    // "get" permite usarlo como si fuera una variable: directionInput.direction
    // Devuelve la dirección más reciente (o undefined si no se presiona nada).
    get direction() {
        return this.heldDirections[0];
    }

    // Empieza a escuchar el teclado.
    init() {
        // Cuando se PRESIONA una tecla...
        document.addEventListener("keydown", e => {
            const dir = this.map[e.code]; // Traducimos la tecla a dirección
            // Si es una dirección válida y no estaba ya en la lista...
            if (dir && this.heldDirections.indexOf(dir) === -1) {
                this.heldDirections.unshift(dir); // ...la ponemos al INICIO de la lista
            }
        });

        // Cuando se SUELTA una tecla...
        document.addEventListener("keyup" , e => {
            const dir = this.map[e.code];
            const index = this.heldDirections.indexOf(dir); // ¿En qué posición está?
            if(index > -1 ) {                               // -1 significa "no está"
                this.heldDirections.splice(index, 1);       // La quitamos de la lista
            }
        })
    }

}
