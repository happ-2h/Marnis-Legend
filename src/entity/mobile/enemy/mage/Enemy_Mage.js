import Enemy             from "../Enemy";
import PickupHandler     from "../../../pickup/PickupHandler";
import Animation         from "../../../../gfx/Animation";
import PU_Powerup        from "../../../pickup/PU_Powerup";
import Bullet_MagicSpear from "../../bullet/Bullet_MagicSpear";

export default class Enemy_Mage extends Enemy {
  #bullets;

  #fireDelay; // Delay to fire weapon
  #fireTimer; // Timer to activate weapon

  /**
   * @param {Number} x   - x-position of the enemy
   * @param {Number} y   - y-position of the enemy
   * @param {String} map - Map enemy belongs to
   */
  constructor(x=0, y=0, map=null) {
    super(x, y, null, map);

    this.#fireDelay = 0.8;
    this.#fireTimer = 0;

    this.#bullets = [];

    this.hp = 4;
    this.maxHp = this.hp;
    this.hitbox.pos.set(4, 7);
    this.hitbox.dim.set(8, 8);

    this.src.y = 32;

    this.animation = new Animation([32, 33], 13);
  }

  update(gos, dt) {
    this.#fireTimer += dt;

    if (this.#fireTimer >= this.#fireDelay) {
      this.#fireTimer = 0;

      this.#bullets.push(new Bullet_MagicSpear(
        this.dst.x + 4,
        this.dst.y + 8,
        this.map
      ));
    }

    for (let i = 0; i < this.#bullets.length; ++i) {
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

    PickupHandler.add(new PU_Powerup(
      this.dst.x,
      this.dst.y,
      this.map
    ));
  }
};