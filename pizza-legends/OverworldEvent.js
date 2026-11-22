// =====================================================================
// OverworldEvent.js
// Un "evento" es algo especial que pasa en el juego, por ejemplo cambiar de mapa
// al cruzar una puerta. Por ahora solo existe el evento "changeMap".
// =====================================================================

class OverworldEvent {
  // Recibe el mapa actual y el evento a ejecutar, por ejemplo { type: "changeMap", map: "Kitchen" }.
  constructor({ map, event }) {
    this.map = map;
    this.event = event;
  }

  // Evento "changeMap": carga otro mapa (otra habitación).
  // resolve() avisa que el evento ya terminó.
  changeMap(resolve) {
    this.map.overworld.startMap( window.OverworldMaps[this.event.map] );
    resolve();
  }

  // Ejecuta el evento.
  // Devuelve una "Promesa": una forma de decir "avísame cuando termines".
  // this[this.event.type] busca la función con el nombre del evento.
  // Ejemplo: si type es "changeMap", llama a this.changeMap(resolve).
  init() {
    return new Promise(resolve => {
      this[this.event.type](resolve)
    })
  }
}
