import Animation from "../../../../gfx/Animation";
import Bullet_Knife from "../../bullet/Bullet_Knife";
import Player from "../Player";

export default class Thief extends Player {
  #knives;

  constructor(x=0, y=0, num=1, map=null) {
    super(x, y, num, map);

    this.src.x = 160;

    this.primaryRate = 0.25;
    this.secondaryRate = 0.5;

    this.vel.set(150, 150);

    this.animation = new Animation([10,11,10,12], 8);

    this.#knives = [];
  }

  update(gos, dt) {
    super.update(dt);

    this.primaryRateTimer += dt;
    this.secondaryRateTimer += dt;

    if (this.status & Player.PRIMARY_FLAG) {
      this.#knives.push(new Bullet_Knife(
        this.dst.x + 4,
        this.dst.y - 4,
        this.map
      ));

      this.status ^= Player.PRIMARY_FLAG;
    }

    if (this.status & Player.SECONDARY_FLAG) {
      if (!this.block && this.controller.isRequestingRight()) {
        this.dst.x += 16;
      }
      else if (!this.block && this.controller.isRequestingLeft()) {
        this.dst.x -= 16;
      }
      else if (!this.block && this.controller.isRequestingUp()) {
        this.dst.y -= 16;
      }
      else if (!this.block && this.controller.isRequestingDown()) {
        this.dst.y += 16;
      }

      this.status ^= Player.SECONDARY_FLAG;
    }

    for (let i = 0; i < this.#knives.length; ++i) {
      this.#knives[i].update(gos, dt);

      if (this.#knives[i].isDead) {
        this.#knives.splice(i, 1);
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

    this.#knives.forEach(k => k.draw());
  }
};