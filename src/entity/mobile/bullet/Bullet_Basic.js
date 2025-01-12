import Bullet from "./Bullet";
import Player from "../player/Player";
import Vec2D  from "../../../math/Vec2D";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../../game/constants";

export default class Bullet_Basic extends Bullet {
  #currFrame;  // Current frame
  #frameTimer; // Time variable
  #frameDelay; // Delay for next animation frame

  #startPos;   // Starting/spawning position;

  /**
   * @param {Number} x   - x-position  of the bullet
   * @param {Number} y   - y-position  of the bullet
   * @param {Number} dx  - x-direction of the bullet
   * @param {Number} dy  - y-direction of the bullet
   * @param {Number} vx  - x-velocity  of the bullet
   * @param {Number} vy  - y-velocity  of the bullet
   * @param {String} map - Map bullet belongs to
   */
  constructor(x=0, y=0, dx=0, dy=0, vx=0, vy=0, map=null) {
    super(x, y, 1, map);

    this.#currFrame = 48;
    this.#frameTimer = 0;
    this.#frameDelay = 0.05;

    this.#startPos = new Vec2D(x, y);

    this.src.x = 40;
    this.src.y = 48;
    this.src.w =  8;
    this.src.h =  8;
    this.dst.w =  8;
    this.dst.h =  8;

    this.vel.set(vx, vy);

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

      // Check if bullet is off screen
      if (
        this.dst.x <= -this.dst.w ||
        this.dst.x >= SCREEN_WIDTH ||
        this.dst.y <= this.#startPos.y - SCREEN_HEIGHT ||
        this.dst.y >= this.#startPos.y + SCREEN_HEIGHT
      ) this.kill();
    });

    // Animation
    this.#frameTimer += dt;
    if (this.#frameTimer >= this.#frameDelay) {
      this.#frameTimer = 0;
      this.#currFrame = this.#currFrame === 48 ? 56 : 48;
      this.src.y = this.#currFrame;
    }
  }
};