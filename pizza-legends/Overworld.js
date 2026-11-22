// =====================================================================
// Overworld.js
// El "motor" del juego: prepara todo y dibuja el juego una y otra vez
// (unas 60 veces por segundo) para que se vea en movimiento.
// =====================================================================

class Overworld {
 // constructor: se ejecuta al crear el juego con "new Overworld(...)".
 constructor(config) {
   this.element = config.element;                             // El <div class="game-container">
   this.canvas = this.element.querySelector(".game-canvas");  // El <canvas> donde se dibuja
   this.ctx = this.canvas.getContext("2d");                   // El "pincel" para dibujar en 2D
   this.map = null;                                           // El mapa actual (se carga después)
 }

 // El "bucle del juego": se repite sin parar.
 startGameLoop() {
  // step = un "paso" o cuadro (frame) del juego.
  const step = () => {

    // 1. Borramos todo lo que había dibujado en el cuadro anterior.
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // La cámara sigue al héroe (el personaje que controlas).
    const cameraPerson = this.map.gameObjects.hero;

    // 2. Actualizamos a todos los personajes (moverse, cambiar animación...).
    //    Le pasamos la flecha presionada y el mapa.
    Object.values(this.map.gameObjects).forEach(object => {
      object.update({
        arrow: this.directionInput.direction,
        map: this.map,
      })
    })

    // 3. Dibujamos en capas, de atrás hacia adelante:
    //    a) El piso y las paredes (capa de abajo).
    this.map.drawLowerImage(this.ctx, cameraPerson);

    //    b) Los personajes.
    Object.values(this.map.gameObjects).forEach(object => {
      object.sprite.draw(this.ctx, cameraPerson);
    })

    //    c) Lo que va por encima de los personajes (techos, bordes).
     this.map.drawUpperImage(this.ctx, cameraPerson);

    // 4. Le pedimos al navegador que vuelva a llamar a step() en el próximo cuadro.
    //    Así el juego se repite unas 60 veces por segundo.
    requestAnimationFrame(()=>{
      step();
    })
  }
  step(); // Arrancamos el primer paso
 }

 // Escucha el aviso "PersonWalkingComplete" (alguien terminó de dar un paso).
 // Si fue el héroe, revisamos si pisó una casilla especial (por ejemplo, una puerta).
 bindHeroPositionCheck() {
   document.addEventListener("PersonWalkingComplete", e => {
     if (e.detail.whoId === "hero") {
       this.map.checkForFootstepCutscene()
     }
   })
 }

 // Carga un mapa (una habitación) y coloca a sus personajes.
 startMap(mapConfig) {
   this.map = new OverworldMap(mapConfig);
   this.map.overworld = this;   // El mapa guarda una referencia al juego (para poder cambiar de mapa)
   this.map.mountObjects();     // Coloca a los personajes en el mapa
 }

 // Arranca todo el juego.
 init() {
   this.startMap(window.OverworldMaps.DemoRoom); // Empezamos en la habitación "DemoRoom"
   this.bindHeroPositionCheck();                 // Vigilamos dónde pisa el héroe

   this.directionInput = new DirectionInput();   // Preparamos el teclado
   this.directionInput.init();

   this.startGameLoop();                         // ¡Arranca el bucle del juego!
 }
}
