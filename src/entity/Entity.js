import { TILE_SIZE } from "../game/constants";

export default class Entity {
  #dst; // Destination rectangle

  constructor(x=0, y=0) {
    if (this.constructor === Entity)
      throw new Error("Can't instantiate abstract class Entity");

    // Required abstract methods
    if (this.init === undefined)
      throw new Error("init() must be implemented");
    if (this.update === undefined)
      throw new Error("update(dt) must be implemented");
    if (this.draw === undefined)
      throw new Error("draw() must be implemented");

    this.#dst = { x: 0, y: 0, w: TILE_SIZE, h: TILE_SIZE };
  }

  // Accessors
  get dst() { return this.#dst; }

  // Mutators
  set dst(dst) { this.#dst = dst; }
};