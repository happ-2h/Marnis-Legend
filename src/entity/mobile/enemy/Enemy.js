import Entity_Mob from "../Entity_Mob";
import Controller from "../../../controller/Controller";

export default class Enemy extends Entity_Mob {
  #gotHit; // Prevents multiple hits from one attack

  /**
   * @param {Number}     x          - x-position of the enemy
   * @param {Number}     y          - y-position of the enemy
   * @param {Controller} controller - Control handler of the entity
   * @param {String}     map        - Map enemy belongs to
   */
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