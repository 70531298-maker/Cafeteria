// =====================================================================
// OverworldMap.js
// Un mapa (una habitación) del juego: sus imágenes, sus personajes,
// sus paredes y sus casillas especiales (como las puertas).
// Al final del archivo están los datos de cada mapa: DemoRoom y Kitchen.
// =====================================================================

class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;          // Personajes del mapa (hero, npc1...)
    this.overworld = null;                          // Referencia al juego (se pone después)
    this.walls = config.walls || {};                // Casillas donde no se puede pasar
    this.cutsceneSpaces = config.cutsceneSpaces || {}; // Casillas que activan un evento (puertas)
    this.isCutscenePlaying = false;                 // ¿Hay un evento en curso? (bloquea el movimiento)

    // Imagen de abajo: piso y paredes.
    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    // Imagen de arriba: cosas que tapan a los personajes (techos, bordes).
    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;
  }

  // Dibuja la imagen de abajo, movida según la cámara (para que el héroe quede al centro).
  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    )
  }

  // Dibuja la imagen de arriba (encima de los personajes).
  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
     )
  }

  // ¿Hay una pared en la casilla a la que quiero moverme?
  isSpaceTaken(currentX, currentY, direction) {
    const {x,y} = utils.nextPosition(currentX, currentY, direction); // Siguiente casilla
    return this.walls[`${x},${y}`] || false;                        // true si hay pared
  }

  // Ejecuta una lista de eventos, uno detrás de otro.
  // "async" y "await" permiten esperar a que cada evento termine antes de pasar al siguiente.
  async startCutscene(events) {
    this.isCutscenePlaying = true;  // Bloquea el movimiento mientras tanto
    for (let i = 0; i < events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      })
      await eventHandler.init();    // Espera a que termine este evento
    }
    this.isCutscenePlaying = false; // Ya se puede mover otra vez
  }

  // Revisa si el héroe pisó una casilla especial (por ejemplo, una puerta).
  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[ `${hero.x},${hero.y}` ]; // ¿Hay algo en esta casilla?
    if (!this.isCutscenePlaying && match) {
      this.startCutscene( match[0].events ) // Si hay, ejecuta sus eventos
    }
  }

  // Coloca a todos los personajes en el mapa.
  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {
      let object = this.gameObjects[key];
      object.id = key;      // Le ponemos su nombre ("hero", "npc1"...)
      object.mount(this);   // Lo colocamos en el mapa
    })
  }

  // Pone una pared en una casilla.
  addWall(x,y){
    this.walls[`${x},${y}`] = true;
  }
  // Quita la pared de una casilla.
  removeWall(x,y) {
    delete this.walls[`${x},${y}`]
  }
  // Mueve una pared a la siguiente casilla (se usa cuando un personaje camina,
  // porque cada personaje tiene una pared invisible para que nadie lo atraviese).
  moveWall(wasX, wasY, direccion) {
    this.removeWall(wasX, wasY);
    const {x,y} = utils.nextPosition(wasX, wasY, direccion);
    this.addWall(x,y);
  }
}

// =====================================================================
// DATOS DE LOS MAPAS
// window.OverworldMaps guarda todas las habitaciones del juego.
// =====================================================================
window.OverworldMaps = {
  // ---- Habitación inicial ----
  DemoRoom: {
    lowerSrc: "images/maps/DemoLower.png",   // Imagen del piso
    upperSrc: "images/maps/DemoUpper.png",   // Imagen de encima
    gameObjects: {
      // El héroe: lo controla el jugador. Empieza en la casilla (5, 6).
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(6),
      }),
      // Un NPC (personaje que no controla el jugador) en la casilla (7, 9).
      npc1: new Person({
      x: utils.withGrid(7),
        y: utils.withGrid(9),
        src: "images/characters/people/npc1.png"
      })
    },

    // Paredes: casillas donde no se puede pasar (por ejemplo, la mesa).
    walls: {
      [utils.asGridCoord(7,6)] : true,
      [utils.asGridCoord(8,6)] : true,
      [utils.asGridCoord(7,7)] : true,
      [utils.asGridCoord(8,7)] : true,
      [utils.asGridCoord(5,11)] : true,
    },

    // Casillas especiales: al pisar la (5, 10), que es la puerta, se va a la cocina.
    cutsceneSpaces: {
      [utils.asGridCoord(5,10)]: [
        { events: [ { type: "changeMap", map: "Kitchen" } ] }
      ]
    }
  },

  // ---- Cocina ----
    Kitchen: {
    lowerSrc: "images/maps/KitchenLower.png",
    upperSrc: "images/maps/KitchenUpper.png",
    gameObjects: {
      // El héroe aparece en la puerta (5, 10), mirando hacia arriba.
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(10),
        direction: "up",
      }),
    },
    walls: {
      [utils.asGridCoord(5,11)] : true,
    },
    // Al volver a pisar la puerta (5, 10), regresa a la habitación inicial.
    cutsceneSpaces: {
      [utils.asGridCoord(5,10)]: [
        { events: [ { type: "changeMap", map: "DemoRoom" } ] }
      ]
    }
  },
}
