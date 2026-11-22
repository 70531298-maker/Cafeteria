// =====================================================================
// GameObject.js
// "Molde" (clase) base para cualquier cosa que aparece en el mapa.
// Person.js hereda de aquí y le agrega la capacidad de caminar.
// =====================================================================

class GameObject {
  constructor(config) {
    this.id = null;          // Nombre del objeto ("hero", "npc1"...). Sirve para saber quién terminó de caminar
    this.isMounted = false;  // ¿Ya fue colocado en el mapa?
    this.x = config.x || 0;  // Posición horizontal en píxeles (si no se da, 0)
    this.y = config.y || 0;  // Posición vertical en píxeles
    this.direction = config.direction || "down" // Hacia dónde mira (por defecto, abajo)

    // Su dibujo (sprite). Si no se indica imagen, usa la del héroe.
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || "images/characters/people/hero.png",
    });
  }

  // Coloca el objeto en el mapa.
  // También pone una "pared" donde está, para que nadie lo atraviese.
  mount(map) {
    this.isMounted = true;
    map.addWall(this.x, this.y);
  }

  // Se llama en cada cuadro del juego. Aquí no hace nada;
  // Person.js lo reemplaza con su propia versión para poder caminar.
  update() {

  }
}
