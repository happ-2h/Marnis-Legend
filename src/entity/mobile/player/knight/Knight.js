import { TILE_SIZE } from "../../../../game/constants";
import Renderer from "../../../../gfx/Renderer";
import Rectangle from "../../../../utils/Rectangle";
import Enemy from "../../enemy/Enemy";
import Player from "../Player";

export default class Knight extends Player {
  // Sword swinging
  #attack;
  #attackRate;

  #swordHitbox;

  constructor(x=0, y=0) {
    super(x, y);

    this.src.x = 16;

    this.#attack = 0;
    this.#attackRate = 0.2;

    this.#swordHitbox = new Rectangle(0, 0, TILE_SIZE, TILE_SIZE);
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