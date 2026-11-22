// =====================================================================
// Person.js
// Un personaje que puede caminar (el héroe o los NPC).
// "extends GameObject" = hereda todo lo de GameObject y le agrega más cosas.
// =====================================================================

class Person extends GameObject {
    constructor(config) {
        super(config); // Ejecuta primero el constructor de GameObject (x, y, sprite...)

        // Cuántos píxeles le faltan para terminar el paso actual.
        // Un paso es de 16 píxeles y se avanza de 1 en 1 para que se vea suave.
        this.movingProgressRemaining = 0;

        // ¿Lo controla el jugador con el teclado? (solo el héroe)
        this.isPlayerControlled = config.isPlayerControlled || false;

        // Qué cambia según la dirección:
        // "up" → la y baja en 1, "right" → la x sube en 1, etc.
        this.directionUpdate = {
            "up": ["y", -1],
            "down": ["y", 1],
            "left": ["x", -1],
            "right": ["x", 1],
        }
    }

    // Se llama en cada cuadro del juego.
    update(state) {
        if (this.movingProgressRemaining > 0) {
            // Si está a mitad de un paso, sigue avanzando.
            this.updatePosition();
        } else {
          // Si está quieto, revisamos si debe empezar a caminar:
          // - que no haya una escena especial en curso (cambio de mapa),
          // - que sea el personaje del jugador,
          // - y que haya una flecha presionada.
          if (!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow) {
            this.starBehavior(state, {
                type: "walk",
                direction: state.arrow
            })
          }
          this.updateSprite(state); // Actualiza la animación (quieto o caminando)
        }
    }

    // Empieza una acción (por ahora solo "walk" = caminar).
    starBehavior(state, behavior) {
        this.direction = behavior.direction; // Mira hacia la nueva dirección
        if (behavior.type === "walk") {

            // Si hay una pared en la siguiente casilla, no se mueve (solo gira).
            if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
                return;
            }
            // Mueve su "pared" invisible a la nueva casilla para que nadie choque con él.
            state.map.moveWall(this.x, this.y, this.direction);
            this.movingProgressRemaining = 16; // Faltan 16 píxeles para completar el paso
        }
    }

    // Avanza 1 píxel en la dirección actual.
    updatePosition() {
    // Ejemplo: si va a la derecha, property = "x" y change = 1.
    const [property, change] = this.directionUpdate[this.direction]
    this[property] += change;          // this["x"] += 1 → se mueve 1 píxel
    this.movingProgressRemaining -= 1; // Le falta 1 píxel menos

    // Si ya terminó el paso, avisa a todo el juego "terminé de caminar".
    if (this.movingProgressRemaining === 0) {
        utils.emitEvent("PersonWalkingComplete", { whoId: this.id })
    }
}

    // Elige la animación correcta.
    updateSprite() {
        // Si se está moviendo: animación de caminar (por ejemplo "walk-down").
        if (this.movingProgressRemaining > 0) {
            this.sprite.setAnimation("walk-"+this.direction);
            return;
        }
        // Si está quieto: animación de parado (por ejemplo "idle-down").
        this.sprite.setAnimation("idle-"+this.direction);
    }
}
