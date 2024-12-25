import Entity_Mob from "../Entity_Mob";

export default class Enemy extends Entity_Mob {
  #gotHit; // Prevents multiple hits from one attack

  constructor(x=0, y=0, controller=null, map=null) {
    super(x, y, controller, map);

    this.#gotHit = false;
  }

  clean() {}

  draw() {
    super.draw();
    this.drawHpBar(true);
  }

  // Accessors
  get gotHit() { return this.#gotHit; }

  // Mutators
  set gotHit(hit) { this.#gotHit = hit; }
};