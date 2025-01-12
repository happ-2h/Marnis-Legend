import Bullet from "./Bullet";
import Player from "../player/Player";
import { SCREEN_HEIGHT } from "../../../game/constants";

export default class Bullet_BossEyeLaser extends Bullet {
  #currFrame;  // Current frame
  #frameTimer; // Time variable
  #frameDelay; // Delay for next animation frame

  /**
   * @param {Number} x   - x-position of the bullet
   * @param {Number} y   - y-position of the bullet
   * @param {String} map - Map bullet belongs to
   */
  constructor(x=0, y=0, map=null) {
    super(x, y, 1, map);

    this.#currFrame  = 0;
    this.#frameTimer = 0;
    this.#frameDelay = 0.05;

    this.src.x =   0;
    this.src.y = 152;
    this.src.w =   4;
    this.src.h =   4;
    this.dst.w =   4;
    this.dst.h =   4;

    this.vel.set(100, 100);

    this.dir.set(0, 1);
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