import { SCREEN_HEIGHT_TILES } from "../../../game/constants";
import Player from "../player/Player";
import Bullet from "./Bullet";

export default class Bullet_MagicSpear extends Bullet {
  #currFrame;  // Current frame
  #frameTimer; // Time variable
  #frameDelay; // Delay for next animation frame

  constructor(x=0, y=0, map=null) {
    super(x, y, map);

    this.src.x = 0;
    this.src.y = 48;
    this.src.w = 8;
    this.dst.w = 8;

    this.vel.set(0, 75);

    this.#currFrame = 0;
    this.#frameTimer = 0;
    this.#frameDelay = 0.05;
  }

  update(gos, dt) {
    const nexty = this.dst.y + this.vel.y * dt;

    this.dst.y = nexty;

    gos.forEach(go => {
      if (go instanceof Player) {
        if (this.dst.intersects(go.hitboxAdj())) {
          this.kill();
        }
        // If bullet is player y pos + one screen, clean up
        if (this.dst.y > go.dst.y + (SCREEN_HEIGHT_TILES<<4)) {
          this.kill();
        }
      }
    });

    this.#frameTimer += dt;
    if (this.#frameTimer >= this.#frameDelay) {
      this.#frameTimer = 0;

      this.#currFrame = this.#currFrame === 0 ? 8 : 0;
      this.src.x = this.#currFrame;
    }
  }
};