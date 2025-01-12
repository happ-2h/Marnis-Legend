import Enemy         from "../Enemy";
import Player        from "../../player/Player";
import PickupHandler from "../../../pickup/PickupHandler";
import Animation     from "../../../../gfx/Animation";
import Renderer      from "../../../../gfx/Renderer";
import Vec2D         from "../../../../math/Vec2D";
import Bullet_Basic  from "../../bullet/Bullet_Basic";
import PU_Health     from "../../../pickup/PU_Health";

import { randInt } from "../../../../math/utils";
import { SCREEN_WIDTH, TILE_SIZE } from "../../../../game/constants";

export default class Enemy_Crow extends Enemy {
  #bullets;

  #frames;     // Number of update frames
  #moveFrames; // Number of frames for next movement

  /**
   * @param {Number} x   - x-position of the enemy
   * @param {Number} y   - y-position of the enemy
   * @param {String} map - Map enemy belongs to
   */
  constructor(x=0, y=0, map=null) {
    super(x, y, null, map);

    this.src.x = 96;
    this.src.y = 32;

    this.hp = 3;
    this.maxHp = this.hp;
    this.hitbox.pos.set(5, 8);
    this.hitbox.dim.set(6, 6);

    this.vel.set(60, 60);
    this.dir.set(12,45);
    this.dir.normalize();

    this.#frames = 0;
    this.#moveFrames = 20;

    this.#bullets = [];

    this.animation = new Animation([38, 39], 10);
  }

  update(gos, dt) {
    ++this.#frames;

    if (!(this.#frames%this.#moveFrames)) {
      this.dir.set(
        Math.random() * [1, -1][(Math.random() >= 0.5)&1],
        Math.random()
      );
      this.dir.normalize();
      this.dir.scale(randInt(1, 3));

      // Shoot player's direction
      gos.forEach(go => {
        if (go instanceof Player) {
          const bDir = Vec2D.sub(go.dst.pos, this.dst.pos);
          bDir.normalize();

          this.#bullets.push(new Bullet_Basic(
            this.dst.x + 4,
            this.dst.y + 4,
            bDir.x,
            bDir.y,
            100, 100,
            this.map
          ));
        }
      });
    }

    let nextx = this.dst.x + this.vel.x * this.dir.x * dt;
    let nexty = this.dst.y + this.vel.y * this.dir.y * dt;

    // Keep in screen bounds
    if (nextx <= 0) {
      nextx = 0;
      this.dir.x = -this.dir.x;
    }
    else if (nextx >= SCREEN_WIDTH - this.dst.w) {
      nextx = SCREEN_WIDTH - this.dst.w;
      this.dir.x = -this.dir.x;
    }

    this.dst.x = nextx;
    this.dst.y = nexty;

    // Check player collision
    gos.forEach(go => {
      if (go instanceof Player) {
        if (this.dst.intersects(go.hitboxAdj())) {
          go.hurt(this.maxHp<<1);
          this.kill();
        }
      }
    });

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

    // Shadow
    Renderer.image(
      "spritesheet",
      (this.animation.currentFrame&0xF)<<4,
      48, 16, 16,
      this.dst.x, this.dst.y + TILE_SIZE,
      16, 16
    );

    this.#bullets.forEach(b => b.draw());
  }

  kill() {
    super.kill();
    this.#bullets.splice(0, this.#bullets.length);

    PickupHandler.add(new PU_Health(
      this.dst.x,
      this.dst.y,
      this.map
    ));
  }
};