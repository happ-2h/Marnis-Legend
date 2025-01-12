import Player         from "../Player";
import PickupHandler  from "../../../pickup/PickupHandler";
import Animation      from "../../../../gfx/Animation";
import Bullet_Arrow   from "../../bullet/Bullet_Arrow";
import Bullet_Grenade from "../../bullet/Bullet_Grenade";

export default class Archer extends Player {
  #bullets;

  /**
   * @param {Number} x   - x-position of the player
   * @param {Number} y   - y-position of the player
   * @param {Number} num - Player number (1 or 2)
   * @param {String} map - Map player belongs to
   */
  constructor(x=0, y=0, num=1, map=null) {
    super(x, y, num, map);

    this.src.x = 64;
    this.primaryRate   = 0.6;
    this.secondaryRate = 0.6;

    this.#bullets = [];

    this.animation = new Animation([4,5,4,6], 10);
  }

  update(gos, dt) {
    super.update(dt);

    this.primaryRateTimer   += dt;
    this.secondaryRateTimer += dt;

    if (this.status & Player.PRIMARY_FLAG) {
      this.#bullets.push(new Bullet_Arrow(
        this.dst.x + 4,
        this.dst.y - 4,
        this.map
      ));

      this.status ^= Player.PRIMARY_FLAG;
    }

    if (this.status & Player.SECONDARY_FLAG) {
      this.#bullets.push(new Bullet_Grenade(
        this.dst.x + 4,
        this.dst.y - 4,
        this.map
      ));

      this.status ^= Player.SECONDARY_FLAG;
    }

    for (let i = 0; i < this.#bullets.length; ++i) {
      this.#bullets[i].update(gos, dt);

      if (this.#bullets[i].isDead) this.#bullets.splice(i, 1);
    }

    // Pickups
    PickupHandler.pickups.forEach(p => {
      if (this.hitboxAdj().intersects(p.dst)) {
        p.effect(this);
        p.kill();
      }
    });

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

  powerup() {
    this.primaryRate = this.primaryRate - 0.1 <= 0.2
      ? 0.2
      : this.primaryRate - 0.1;
  }
}