import Animation from "../../../../gfx/Animation";
import Bullet_Orb from "../../bullet/Bullet_Orb";
import Player from "../Player";
import { TAU } from "../../../../math/utils";
import PickupHandler from "../../../pickup/PickupHandler";

export default class Mage extends Player {
  #bullets;

  #nSecOrbs; // Number of secondary orbs

  constructor(x=0, y=0, num=1, map=null) {
    super(x, y, num, map);

    this.src.x = 112;

    this.primaryRate = 1;

    this.#bullets = [];
    this.#nSecOrbs = 12;

    this.hp = 24;
    this.maxHp = 24;

    this.animation = new Animation([7,8,7,9], 10);
  }

  update(gos, dt) {
    super.update(dt);

    this.primaryRateTimer   += dt;
    this.secondaryRateTimer += dt;

    if (this.status & Player.PRIMARY_FLAG) {
      this.#bullets.push(new Bullet_Orb(
        this.dst.x + 4,
        this.dst.y - 4,
        0, -1,
        1,
        this.map
      ));
      this.#bullets.push(new Bullet_Orb(
        this.dst.x + 4,
        this.dst.y - 4,
        Math.cos((4*Math.PI)/3),
        Math.sin((4*Math.PI)/3),
        1,
        this.map
      ));
      this.#bullets.push(new Bullet_Orb(
        this.dst.x + 4,
        this.dst.y - 4,
        -Math.cos((4*Math.PI)/3),
        Math.sin((4*Math.PI)/3),
        1,
        this.map
      ));

      this.status ^= Player.PRIMARY_FLAG;
    }
    if (this.status & Player.SECONDARY_FLAG) {
      for (let i = 0; i < this.#nSecOrbs; ++i) {
        const t = i / this.#nSecOrbs;
        const ang = t * TAU;

        this.#bullets.push(new Bullet_Orb(
          this.dst.x + 4,
          this.dst.y + 4,
          Math.cos(ang),
          Math.sin(ang),
          2,
          this.map
        ));
      }

      this.status ^= Player.SECONDARY_FLAG;
    }

    for (let i = 0; i < this.#bullets.length; i++) {
      this.#bullets[i].update(gos, dt);

      if (this.#bullets[i].isDead) {
        this.#bullets.splice(i, 1);
      }
    }

    // Pickups
    const pu = PickupHandler.pickups;

    pu.forEach(p => {
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
    this.primaryRate = this.primaryRate - 0.15 <= 0.3
      ? 0.5
      : this.primaryRate - 0.15;
  }

  draw() {
    super.draw();

    this.#bullets.forEach(b => b.draw());
  }
};