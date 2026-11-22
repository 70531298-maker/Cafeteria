// =====================================================================
// Sprite.js
// Se encarga del DIBUJO de un personaje y de su animación.
// La imagen del personaje (por ejemplo hero.png) es una "hoja" con varios
// dibujos pequeños de 32 x 32 píxeles: cada fila es una dirección y cada
// columna un momento de la animación. Mostrando uno tras otro, parece que camina.
// =====================================================================

class Sprite {
  constructor(config) {

    // Preparar la imagen del personaje
    this.image = new Image();
    this.image.src = config.src;
    // Cuando la imagen termine de cargar, lo anotamos (no se puede dibujar antes).
    this.image.onload = () => {
      this.isLoaded = true;
    }

    // Sombra que va debajo del personaje
    this.shadow = new Image();
    this.useShadow = true;
    if (this.useShadow) {
      this.shadow.src = "images/characters/shadow.png";
    }
    this.shadow.onload = () => {
      this.isShadowLoaded = true;
    }

    // Configurar las animaciones.
    // Cada animación es una lista de dibujos [columna, fila] dentro de la hoja.
    // "idle" = quieto, "walk" = caminando.
    this.animations = config.animations || {
      "idle-down": [ [0,0] ],
      "idle-right": [ [0,1] ],
      "idle-up": [ [0,2] ],
      "idle-left": [ [0,3] ],
      "walk-down": [ [1,0],[0,0],[3,0],[0,0], ],
      "walk-right": [ [1,1],[0,1],[3,1],[0,1], ],
      "walk-up": [ [1,2],[0,2],[3,2],[0,2], ],
      "walk-left": [ [1,3],[0,3],[3,3],[0,3], ]
    }
    this.currentAnimation = "idle-right";  // Animación con la que empieza
    this.currentAnimationFrame = 0;        // Qué dibujo de la animación se muestra ahora

    // Cada cuántos cuadros del juego se pasa al siguiente dibujo
    // (para que la animación no vaya demasiado rápido).
    this.animationFrameLimit = config.animationFrameLimit || 4;
    this.animationFrameProgress = this.animationFrameLimit;

    // A qué personaje pertenece este dibujo (para saber su posición).
    this.gameObject = config.gameObject;
  }

  // Devuelve el dibujo actual, por ejemplo [1,0].
  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame]
  }

  // Cambia de animación (por ejemplo de "idle-down" a "walk-down").
  // Solo si es distinta a la actual, para no reiniciarla a cada rato.
  setAnimation(key) {
    if (this.currentAnimation !== key) {
      this.currentAnimation = key;
      this.currentAnimationFrame = 0;
      this.animationFrameProgress = this.animationFrameLimit;
    }
  }

  // Avanza la animación poco a poco.
  updateAnimationProgress() {
    // Cuenta regresiva: mientras no llegue a 0, esperamos.
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1;
      return;
    }
     // Llegó a 0: reiniciamos el contador y pasamos al siguiente dibujo.
     this.animationFrameProgress = this.animationFrameLimit;
     this.currentAnimationFrame += 1;

     // Si ya no hay más dibujos, volvemos al primero (la animación se repite).
     if (this.frame === undefined) {
      this.currentAnimationFrame = 0;
     }
  }

  // Dibuja el personaje en el canvas.
  draw(ctx, cameraPerson) {
    // Calculamos dónde dibujarlo en la pantalla.
    // Se resta la posición de la cámara (el héroe) para que el héroe quede
    // siempre en el centro y el mundo se mueva a su alrededor.
    // -8 y -18 acomodan el dibujo para que los pies queden sobre la casilla.
    const x = this.gameObject.x  - 8 + utils.withGrid(10.5) - cameraPerson.x;
    const y = this.gameObject.y - 18 + utils.withGrid(6) - cameraPerson.y;

    // Si la sombra ya cargó, la dibujamos primero (para que quede debajo).
    this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);

    // Columna y fila del dibujo actual dentro de la hoja.
    const [frameX, frameY] = this.frame;

    // Si la imagen ya cargó, recortamos el pedacito de 32x32 que toca y lo dibujamos.
    this.isLoaded && ctx.drawImage(this.image,
      frameX * 32, frameY * 32, // Desde dónde recortar en la hoja
      32,32,                    // Tamaño del recorte
      x,y,                      // Dónde dibujarlo en la pantalla
      32,32                     // Tamaño en la pantalla
    )

    this.updateAnimationProgress(); // Avanza la animación para el próximo cuadro
  }
}
