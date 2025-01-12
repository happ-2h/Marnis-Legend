import Bullet from "./Bullet";
import Enemy  from "../enemy/Enemy";
import Player from "../player/Player";
import { SCREEN_HEIGHT_TILES } from "../../../game/constants";

export default class Bullet_Arrow extends Bullet {
  #currFrame;
  #frameTimer;
  #frameDelay;

  /**
   * @param {Number} x   - x-position of the bullet
   * @param {Number} y   - y-position of the bullet
   * @param {String} map - Map bullet belongs to
   */
  constructor(x=0, y=0, map=null) {
    super(x, y, 1, map);

    this.src.x = 16;
    this.src.y = 48;
    this.src.w =  8;
    this.dst.w =  8;

    this.vel.set(0, 300);

    this.#currFrame  = 0;
    this.#frameTimer = 0;
    this.#frameDelay = 0.05;
  }

  update(gos, dt) {
    const nexty = this.dst.y - this.vel.y * dt;

    this.dst.y = nexty;

    gos.forEach(go => {
      if (go instanceof Player) {
        // Check if arrow is out of screen
        if (this.dst.y < go.dst.y - (SCREEN_HEIGHT_TILES<<4))
          this.kill();
      }
      else if (go instanceof Enemy) {
        if (this.dst.intersects(go.hitboxAdj())) {
          go.hurt(this.damage);
          this.kill();
        }
      }
    });

    // Animation
    this.#frameTimer += dt;
    if (this.#frameTimer >= this.#frameDelay) {
      this.#frameTimer = 0;
      this.#currFrame = this.#currFrame === 16 ? 24 : 16;
      this.src.x = this.#currFrame;
    }
  }
};