import Entity   from "../Entity";
import Renderer from "../../gfx/Renderer";

import { rand, randInt } from "../../math/utils";

export default class Star extends Entity {
  #life; // Stay alive for N seconds

  /**
   * @param {Number} x   - x-position  of the particle
   * @param {Number} y   - y-position  of the particle
   * @param {Number} dx  - x-direction of the particle
   * @param {Number} dy  - y-direction of the particle
   * @param {String} map - Map particle belongs to
   */
  constructor(x=0, y=0, dx=0, dy=0, map=null) {
    super(x, y, map);

    this.zindex = 99;

    this.src.x = Math.random() >= 0.5 ? 128 : 131;
    this.src.y = Math.random() >= 0.5 ? 80 : 83;
    this.src.w = 3;
    this.src.h = 3;

    this.dst.w = 3;
    this.dst.h = 3;

    this.dir.set(dx, dy);
    this.dir.normalize();
    this.vel.set(
      randInt(50, 100),
      randInt(50, 100)
    );

    this.#life = rand(0.2, 0.4);
  }

  init() {}

  update(dt) {
    this.#life -= dt;
    if (this.#life <= 0) this.kill();

    let nextx = this.dst.x + this.vel.x * this.dir.x * dt;
    let nexty = this.dst.y + this.vel.y * this.dir.y * dt;

    this.dst.x = nextx;
    this.dst.y = nexty;
  }

  draw() { Renderer.vimage("spritesheet", this.src, this.dst); }
};