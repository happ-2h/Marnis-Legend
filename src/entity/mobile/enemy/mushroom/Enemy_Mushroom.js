import Enemy            from "../Enemy";
import PickupHandler    from "../../../pickup/PickupHandler";
import Player           from "../../player/Player";
import Animation        from "../../../../gfx/Animation";
import Bullet_Basic     from "../../bullet/Bullet_Basic";
import PU_Health        from "../../../pickup/PU_Health";
import { TAU }          from "../../../../math/utils";
import { SCREEN_WIDTH } from "../../../../game/constants";

export default class Enemy_Mushroom extends Enemy {
  #fireDelay; // Delay to fire weapon
  #fireTimer; // Timer to activate weapon

  #nBullets;
  #bullets;

  /**
   * @param {Number} x   - x-position of the enemy
   * @param {Number} y   - y-position of the enemy
   * @param {String} map - Map enemy belongs to
   */
  constructor(x=0, y=0, map=null) {
    super(x, y, null, map);

    this.#fireDelay = 1.2;
    this.#fireTimer = 0;

    this.#nBullets = 5;
    this.#bullets = [];

    this.hp = 3;
    this.maxHp = this.hp;
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

    // Wrap around
    if (this.dir.x > 0 && nextx > SCREEN_WIDTH) nextx = 0;

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
          100, 100,
          this.map
        ));
      }
    }

    gos.forEach(go => {
      if (go instanceof Player) {
        // Hurt player
        if (this.dst.intersects(go.hitboxAdj())) {
          go.hurt(this.maxHp<<1);
          this.kill();
        }
      }
    });

    for (let i = 0; i < this.#bullets.length; i++) {
      this.#bullets[i].update(gos, dt);

      if (this.#bullets[i].isDead) this.#bullets.splice(i, 1);
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

    if (Math.random() >= 0.7)
      PickupHandler.add(new PU_Health(
        this.dst.x,
        this.dst.y,
        this.map
      ));
  }
};