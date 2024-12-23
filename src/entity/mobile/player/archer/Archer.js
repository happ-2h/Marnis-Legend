import Animation from "../../../../gfx/Animation";
import Bullet_Arrow from "../../bullet/Bullet_Arrow";
import Player from "../Player";

export default class Archer extends Player {
  #bullets;

  constructor(x=0, y=0, num=1, map=null) {
    super(x, y, num, map);

    this.src.x = 64;
    this.primaryRate = 0.6;

    this.#bullets = [];

    this.animation = new Animation([4,5,4,6], 10);
  }

  update(gos, dt) {
    super.update(dt);

    this.primaryRateTimer += dt;
    if (this.status & Player.PRIMARY_FLAG) {
      this.#bullets.push(new Bullet_Arrow(
        this.dst.x + 4,
        this.dst.y - 4,
        this.map
      ));

      this.status ^= Player.PRIMARY_FLAG;
    }

    for (let i = 0; i < this.#bullets.length; ++i) {
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

  draw() {
    super.draw();

    this.#bullets.forEach(b => b.draw());
  }
}