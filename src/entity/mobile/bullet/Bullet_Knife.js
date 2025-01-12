import Bullet from "./Bullet";
import Vec2D  from "../../../math/Vec2D";
import Player from "../player/Player";
import Enemy  from "../enemy/Enemy";
import { SCREEN_HEIGHT_TILES } from "../../../game/constants";

export default class Bullet_Knife extends Bullet {
  #startPos; // Starting position
  #maxDist;  // Maximum distance

  /**
   * @param {Number} x    - x-position of the bullet
   * @param {Number} y    - y-position of the bullet
   * @param {Number} dist - How long the knife lasts on screen
   * @param {String} map  - Map bullet belongs to
   */
  constructor(x=0, y=0, dist=0, map=null) {
    super(x, y, 1, map);

    this.#startPos = new Vec2D(x, y);
    this.#maxDist  = new Vec2D(0, dist);

    this.src.x = 32;
    this.src.y = 56;
    this.src.w =  8;
    this.src.h =  8;
    this.dst.w =  8;
    this.dst.h =  8;

    this.vel.set(0, 150);

    this.dir.set(0, -1);
    this.dir.normalize();
  }

  update(gos, dt) {
    const nexty = this.dst.y + this.vel.y * this.dir.y * dt;

    if (nexty <= this.#startPos.y - this.#maxDist.y)
      this.kill();

    this.dst.y = nexty;

    gos.forEach(go => {
      if (go instanceof Player) {
        // Check if arrow is out of screen-y
        if (
          this.dst.y < go.dst.y - (SCREEN_HEIGHT_TILES<<4) ||
          this.dst.y > go.dst.y + (SCREEN_HEIGHT_TILES<<2)
        ) this.kill();
      }
      else if (go instanceof Enemy) {
        if (this.dst.intersects(go.hitboxAdj())) {
          go.hurt(this.damage);
          this.kill();
        }
      }
    });
  }
};