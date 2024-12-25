import Bullet from "./Bullet";
import Player from "../player/Player";
import { SCREEN_HEIGHT_TILES, SCREEN_WIDTH } from "../../../game/constants";

export default class Bullet_Basic extends Bullet {
  #currFrame;  // Current frame
  #frameTimer; // Time variable
  #frameDelay; // Delay for next animation frame

  constructor(x=0, y=0, dx=0, dy=0, map=null) {
    super(x, y, 1, map);

    this.#currFrame = 48;
    this.#frameTimer = 0;
    this.#frameDelay = 0.05;

    this.src.x = 40;
    this.src.y = 48;
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

    gos.forEach(go => {
      if (go instanceof Player) {
        // Check if bullet is out of screen-y
        if (
          this.dst.y < go.dst.y - (SCREEN_HEIGHT_TILES<<4) ||
          this.dst.y > go.dst.y + (SCREEN_HEIGHT_TILES<<2)
        ) {
          this.kill();
        }

        if (this.dst.intersects(go.hitboxAdj())) {
          go.hurt(this.damage);
          this.kill();
        }
      }
    });

    if (this.dst.x <= -this.dst.w) this.kill();
    if (this.dst.x >= SCREEN_WIDTH) this.kill();

    this.#frameTimer += dt;
    if (this.#frameTimer >= this.#frameDelay) {
      this.#frameTimer = 0;

      this.#currFrame = this.#currFrame === 48 ? 56 : 48;
      this.src.y = this.#currFrame;
    }
  }
};