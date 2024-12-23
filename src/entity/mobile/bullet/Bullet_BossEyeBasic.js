import { SCREEN_HEIGHT } from "../../../game/constants";
import Bullet from "./Bullet";

export default class Bullet_BossEyeBasic extends Bullet {
  #currFrame;  // Current frame
  #frameTimer; // Time variable
  #frameDelay; // Delay for next animation frame

  constructor(x=0, y=0, dx=0, dy=0, map=null) {
    super(x, y, map);

    this.#currFrame = 0;
    this.#frameTimer = 0;
    this.#frameDelay = 0.05;

    this.src.x = 0;
    this.src.y = 144;
    this.src.w = 8;
    this.src.h = 8;
    this.dst.w = 8;
    this.dst.h = 8;

    this.vel.set(100, 100);

    this.dir.set(dx, dy);
    this.dir.normalize();
  }

  update(gos, dt) {
    const nextx = this.dst.x + this.vel.x * this.dir.x * dt;
    const nexty = this.dst.y + this.vel.y * this.dir.y * dt;

    this.dst.x = nextx;
    this.dst.y = nexty;

    if (this.dst.y >= SCREEN_HEIGHT) {
      this.kill();
    }

    this.#frameTimer += dt;
    if (this.#frameTimer >= this.#frameDelay) {
      this.#frameTimer = 0;

      this.#currFrame = this.#currFrame === 0 ? 8 : 0;
      this.src.x = this.#currFrame;
    }
  }
};