import Animation from "../../../../gfx/Animation";
import Bullet_Orb from "../../bullet/Bullet_Orb";
import Player from "../Player";
import { TAU } from "../../../../math/utils";

export default class Mage extends Player {
  #bullets;

  #nSecOrbs; // Number of secondary orbs

  constructor(x, y, map) {
    super(x, y, map);

    this.src.x = 112;

    this.primaryRate = 1.5;

    this.#bullets = [];
    this.#nSecOrbs = 12;

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
        this.map
      ));
      this.#bullets.push(new Bullet_Orb(
        this.dst.x + 4,
        this.dst.y - 4,
        Math.cos((4*Math.PI)/3),
        Math.sin((4*Math.PI)/3),
        this.map
      ));
      this.#bullets.push(new Bullet_Orb(
        this.dst.x + 4,
        this.dst.y - 4,
        -Math.cos((4*Math.PI)/3),
        Math.sin((4*Math.PI)/3),
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

    this.animation.update(dt);
    this.src.pos.set(
      (this.animation.currentFrame&0xF)<<4,
      (this.animation.currentFrame>>4)<<4
    );
  }

  primaryAction(dt) {
    if (this.primaryRateTimer >= this.primaryRate) {
      this.primaryRateTimer = 0;
      this.status |= Player.PRIMARY_FLAG;
    }
  }

  secondaryAction(dt) {
    if (this.secondaryRateTimer >= this.secondaryRate) {
      this.secondaryRateTimer = 0;
      this.status |= Player.SECONDARY_FLAG;
    }
  }

  draw() {
    super.draw();

    this.#bullets.forEach(b => b.draw());
  }
};