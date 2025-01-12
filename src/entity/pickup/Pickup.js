import Entity    from "../Entity";
import Animation from "../../gfx/Animation";
import Renderer  from "../../gfx/Renderer";

export default class Pickup extends Entity {
  /**
   * @param {Number} x         - x-position of the pickup
   * @param {Number} y         - y-position of the pickup
   * @param {Array}  frames    - Tile IDs for animation
   * @param {Number} animSpeed - Speed to play the animation
   * @param {String} map       - Map the pickup belongs to
   */
  constructor(x=0, y=0, frames=[], animSpeed=0, map=null) {
    super(x, y, map);

    this.animation = new Animation([ ...frames ], animSpeed);
  }

  init() {}

  update(dt) {
    this.animation.update(dt);
    this.src.pos.set(
      (this.animation.currentFrame&0xF)<<4,
      (this.animation.currentFrame>>4)<<4
    );
  }

  draw() { Renderer.vimage("spritesheet", this.src, this.dst); }

  effect(entity=null) {}
};