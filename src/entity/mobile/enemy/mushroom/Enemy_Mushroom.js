import { SCREEN_WIDTH, SCREEN_HEIGHT_TILES } from "../../../../game/constants";
import { TAU } from "../../../../math/utils";
import Animation from "../../../../gfx/Animation";
import Bullet_Basic from "../../bullet/Bullet_Basic";
import Player from "../../player/Player";
import Enemy from "../Enemy";

export default class Enemy_Mushroom extends Enemy {
  #fireDelay; // Delay to fire weapon
  #fireTimer; // Timer to activate weapon

  #nBullets;
  #bullets;

  constructor(x=0, y=0, map=null) {
    super(x, y, null, map);

    this.#fireDelay = 1.2;
    this.#fireTimer = 0;

    this.#nBullets = 5;
    this.#bullets = [];

    this.hp = 2;
    this.hitbox.pos.set(4, 8);
    this.hitbox.dim.set(8, 8);

    this.src.x = 64;
    this.src.y = 32;

    this.vel.set(100, 10);
    this.dir.set(1, 1);
    this.dir.normalize();
    this.dir.scale(2);

    this.animation = new Animation([36,37], 10);
  }

  update(gos, dt) {
    let nextx = this.dst.x + this.vel.x * this.dir.x * dt;
    let nexty = this.dst.y + this.vel.y * this.dir.y * dt;

    if (this.dir.x > 0) {
      if (nextx > SCREEN_WIDTH) {
        nextx = 0;
      }
    }

    this.dst.x = nextx;
    this.dst.y = nexty;

    this.#fireTimer += dt;

    if (this.#fireTimer >= this.#fireDelay) {
      this.#fireTimer = 0;

      for (let i = 0; i < this.#nBullets; ++i) {
        const t = i / this.#nBullets;
        const ang = t * TAU;

        this.#bullets.push(new Bullet_Basic(
          this.dst.x + 4,
          this.dst.y + 4,
          Math.cos(ang),
          Math.sin(ang),
          this.map
        ));
      }
    }

    gos.forEach(go => {
      if (go instanceof Player) {
        // Hurt player
        if (this.dst.intersects(go.hitboxAdj())) {
          // TODO hurt player
          this.clean();
        }
        // Remove if beyond player + one screen
        if (this.dst.y > go.dst.y + (SCREEN_HEIGHT_TILES<<4)) {
          this.clean();
        }
      }
    });

    for (let i = 0; i < this.#bullets.length; i++) {
      this.#bullets[i].update(gos, dt);

      if (this.#bullets[i].isDead) {
        this.#bullets.splice(i, 1);
      }
    }

    this.animation.update(dt);
    this.src.pos.set(
      (this.animation.currentFrame&0xF)<<4,
      (this.animation.currentFrame>>4)<<4
    );
  }

  draw() {
    super.draw();

    this.#bullets.forEach(b => b.draw());
  }

  kill() {
    super.kill();
    this.#bullets.splice(0, this.#bullets.length);
  }
};