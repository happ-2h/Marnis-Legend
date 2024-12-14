import Bullet_MagicSpear from "../../bullet/Bullet_MagicSpear";
import Enemy from "../Enemy";

export default class Enemy_Mage extends Enemy {
  #fireDelay; // Delay to fire weapon
  #fireTimer; // Timer to activate weapon

  #bullets;

  constructor(x=0, y=0) {
    super(x, y, null);

    this.#fireDelay = 0.8; // TODO randomize
    this.#fireTimer = 0;

    this.#bullets = [];

    this.hitbox.pos.set(4, 7);
    this.hitbox.dim.set(8, 8);

    this.src.y = 32;
  }

  update(gos, dt) {
    this.#fireTimer += dt;

    if (this.#fireTimer >= this.#fireDelay) {
      this.#fireTimer = 0;

      this.#bullets.push(new Bullet_MagicSpear(
        this.dst.x + 4,
        this.dst.y + 8
      ))
    }

    for (let i = 0; i < this.#bullets.length; ++i) {
      this.#bullets[i].update(gos, dt);

      if (this.#bullets[i].isDead) {
        // TODO particles
        this.#bullets.splice(i, 1);
      }
    }
  }

  draw() {
    super.draw();

    this.#bullets.forEach(b => b.draw());
  }

  clean() {
    this.#bullets.splice(0, this.#bullets.length);

    this.kill();
  }
};