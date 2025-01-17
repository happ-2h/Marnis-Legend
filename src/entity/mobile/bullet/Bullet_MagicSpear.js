import Bullet from "./Bullet";
import Player from "../player/Player";
import { SCREEN_HEIGHT_TILES } from "../../../game/constants";

export default class Bullet_MagicSpear extends Bullet {
  #currFrame;  // Current frame
  #frameTimer; // Time variable
  #frameDelay; // Delay for next animation frame

  /**
   * @param {Number} x   - x-position of the bullet
   * @param {Number} y   - y-position of the bullet
   * @param {String} map - Map bullet belongs to
   */
  constructor(x=0, y=0, map=null) {
    super(x, y, 2, map);

    this.src.x =  0;
    this.src.y = 48;
    this.src.w =  8;
    this.dst.w =  8;

    this.vel.set(0, 75);

    this.#currFrame  = 0;
    this.#frameTimer = 0;
    this.#frameDelay = 0.05;
  }

  update(gos, dt) {
    const nexty = this.dst.y + this.vel.y * dt;

    this.dst.y = nexty;

    gos.forEach(go => {
      if (go instanceof Player) {
        if (this.dst.intersects(go.hitboxAdj())) {
          go.hurt(this.damage);
          this.kill();
        }
        // If bullet is player y pos + one screen, clean up
        if (this.dst.y > go.dst.y + (SCREEN_HEIGHT_TILES<<4))
          this.kill();
      }
    });

    // Animation
    this.#frameTimer += dt;
    if (this.#frameTimer >= this.#frameDelay) {
      this.#frameTimer = 0;
      this.#currFrame = this.#currFrame === 0 ? 8 : 0;
      this.src.x = this.#currFrame;
    }
  }
};