import { TILE_SIZE } from "../../../../game/constants";
import Renderer from "../../../../gfx/Renderer";
import Rectangle from "../../../../utils/Rectangle";
import Enemy from "../../enemy/Enemy";
import Player from "../Player";
import Animation from "../../../../gfx/Animation";

export default class Knight extends Player {
  // Sword swinging
  #attack;
  #attackRate;

  #swordHitbox;

  constructor(x=0, y=0, map=null) {
    super(x, y, map);

    this.src.x = 16;

    this.#attack = 0;
    this.#attackRate = 0.2;

    this.#swordHitbox = new Rectangle(0, 0, TILE_SIZE, TILE_SIZE);

    this.animation = new Animation([1,2,1,3], 10);
  }

  update(gos, dt) {
    super.update(dt);

    if (this.status & Player.PRIMARY_FLAG) {
      this.#attack += dt;

      this.#swordHitbox.pos.set(this.dst.pos.x, this.dst.pos.y - this.#swordHitbox.h);

      // Check if sword is hitting an enemy
      gos.forEach(go => {
        if (go instanceof Enemy) {
          if (this.#swordHitbox.intersects(go.hitboxAdj())) {
            go.kill();
          }
        }
      });

      // End primary attack
      if (this.#attack >= this.#attackRate) {
        this.#attack = 0;
        this.status ^= Player.PRIMARY_FLAG;
      }
    }
    else {
      this.primaryRateTimer += dt;
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

    // Draw attack
    if (this.status & Player.PRIMARY_FLAG)
      Renderer.vrect(this.#swordHitbox.pos, this.#swordHitbox.dim);
  }
};