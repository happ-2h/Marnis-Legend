import Player          from "../Player";
import ParticleHandler from "../../../particle/ParticleHandler";
import PickupHandler   from "../../../pickup/PickupHandler";
import Animation       from "../../../../gfx/Animation";
import Bullet_Knife    from "../../bullet/Bullet_Knife";
import Dash            from "../../../particle/Dash";

export default class Thief extends Player {
  #knives;    // Container of knife objects
  #throwDist; // Life of knife object

  /**
   * @param {Number} x   - x-position of the player
   * @param {Number} y   - y-position of the player
   * @param {Number} num - Player number (1 or 2)
   * @param {String} map - Map player belongs to
   */
  constructor(x=0, y=0, num=1, map=null) {
    super(x, y, num, map);

    this.src.x = 160;

    this.primaryRate   = 0.25;
    this.secondaryRate = 0.5;

    this.vel.set(150, 150);

    this.#throwDist = 64;

    this.animation = new Animation([10,11,10,12], 8);

    this.#knives = [];
  }

  update(gos, dt) {
    super.update(dt);

    this.primaryRateTimer   += dt;
    this.secondaryRateTimer += dt;

    if (this.status & Player.PRIMARY_FLAG) {
      this.#knives.push(new Bullet_Knife(
        this.dst.x + 4,
        this.dst.y - 4,
        this.#throwDist,
        this.map
      ));

      this.status ^= Player.PRIMARY_FLAG;
    }

    if (this.status & Player.SECONDARY_FLAG) {
      if (!this.block && this.controller.isRequestingRight()) {
        ParticleHandler.add(new Dash(this.dst.x, this.dst.y, 5, this.map));
        this.dst.x += 16;
      }
      else if (!this.block && this.controller.isRequestingLeft()) {
        ParticleHandler.add(new Dash(this.dst.x, this.dst.y, 5, this.map));
        this.dst.x -= 16;
      }
      else if (!this.block && this.controller.isRequestingUp()) {
        ParticleHandler.add(new Dash(this.dst.x, this.dst.y, 5, this.map));
        this.dst.y -= 16;
      }
      else if (!this.block && this.controller.isRequestingDown()) {
        ParticleHandler.add(new Dash(this.dst.x, this.dst.y, 5, this.map));
        this.dst.y += 16;
      }

      this.status ^= Player.SECONDARY_FLAG;
    }

    // Weapon handler
    for (let i = 0; i < this.#knives.length; ++i) {
      this.#knives[i].update(gos, dt);

      if (this.#knives[i].isDead) this.#knives.splice(i, 1);
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

  powerup() {
    this.#throwDist = this.#throwDist + 10 >= 150
      ? 150
      : this.#throwDist + 10;
  }

  draw() {
    super.draw();

    this.#knives.forEach(k => k.draw());
  }
};