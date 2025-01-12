import Bullet from "./Bullet";
import Player from "../player/Player";
import { SCREEN_HEIGHT } from "../../../game/constants";

export default class Bullet_BossEyeBasic extends Bullet {
  #currFrame;  // Current frame
  #frameTimer; // Time variable
  #frameDelay; // Delay for next animation frame

  /**
   * @param {Number} x   - x-position  of the bullet
   * @param {Number} y   - y-position  of the bullet
   * @param {Number} dx  - x-direction of the bullet
   * @param {Number} dy  - y-direction of the bullet
   * @param {String} map - Map bullet belongs to
   */
  constructor(x=0, y=0, dx=0, dy=0, map=null) {
    super(x, y, 3, map);

    this.#currFrame  = 0;
    this.#frameTimer = 0;
    this.#frameDelay = 0.05;

    this.src.x =   0;
    this.src.y = 144;
    this.src.w =   8;
    this.src.h =   8;
    this.dst.w =   8;
    this.dst.h =   8;

    this.vel.set(100, 100);

    this.dir.set(dx, dy);
    this.dir.normalize();
  }

  update(gos, dt) {
    const nextx = this.dst.x + this.vel.x * this.dir.x * dt;
    const nexty = this.dst.y + this.vel.y * this.dir.y * dt;

    this.dst.x = nextx;
    this.dst.y = nexty;

    gos.forEach(go => {
      if (go instanceof Player) {
        if (this.dst.intersects(go.hitboxAdj())) {
          go.hurt(this.damage);
          this.kill();
        }
      }
    });

    if (this.dst.y >= SCREEN_HEIGHT) this.kill();

    // Animation
    this.#frameTimer += dt;
    if (this.#frameTimer >= this.#frameDelay) {
      this.#frameTimer = 0;
      this.#currFrame = this.#currFrame === 0 ? 8 : 0;
      this.src.x = this.#currFrame;
    }
  }
};