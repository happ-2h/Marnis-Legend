import Player        from "../Player";
import PickupHandler from "../../../pickup/PickupHandler";
import Animation     from "../../../../gfx/Animation";
import Renderer      from "../../../../gfx/Renderer";
import Rectangle     from "../../../../utils/Rectangle";
import Enemy         from "../../enemy/Enemy";

import {
  DEBUG,
  TILE_SIZE
} from "../../../../game/constants";

export default class Knight extends Player {
  // Sword swinging
  #attack;
  #attackRate;

  #invDur;   // Invincibility duration
  #invTimer; // Invincibility timer

  #swordHitbox;

  /**
   * @param {Number} x   - x-position of the player
   * @param {Number} y   - y-position of the player
   * @param {Number} num - Player number (1 or 2)
   * @param {String} map - Map player belongs to
   */
  constructor(x=0, y=0, num=1, map=null) {
    super(x, y, num, map);

    this.src.x = 16;

    this.#attack = 0;
    this.#attackRate = 0.2;

    this.#invDur   = 3;
    this.#invTimer = 0;

    this.#swordHitbox = new Rectangle(0, 0, TILE_SIZE, TILE_SIZE);

    this.animation = new Animation([1,2,1,3], 10);
    this.vel.set(50, 50);

    this.hp = 32;
    this.maxHp = this.hp;
  }

  update(gos, dt) {
    super.update(dt);

    this.secondaryRateTimer += dt;

    if (this.status & Player.PRIMARY_FLAG) {
      this.#attack += dt;

      this.#swordHitbox.pos.set(
        this.dst.pos.x,
        this.dst.pos.y - this.#swordHitbox.h
      );

      // Check if sword is hitting an enemy
      gos.forEach(go => {
        if (go instanceof Enemy) {
          if (!go.gotHit && this.#swordHitbox.intersects(go.hitboxAdj())) {
            go.hurt(4);
            go.gotHit = true;
          }
        }
      });

      // End primary attack
      if (this.#attack >= this.#attackRate) {
        this.#attack = 0;
        this.status ^= Player.PRIMARY_FLAG;

        // Reset hit status
        gos.forEach(go => go.gotHit = false);
      }
    }
    else this.primaryRateTimer += dt;

    if (this.status & Player.SECONDARY_FLAG) {
      this.#invTimer += dt;

      if (this.#invTimer >= this.#invDur) {
        this.#invTimer = 0;
        this.secondaryRateTimer = 0;
        this.status ^= Player.SECONDARY_FLAG;
      }
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

    // Draw attack
    if (this.status & Player.PRIMARY_FLAG) {
      Renderer.image(
        "spritesheet",
        48, 48, TILE_SIZE, TILE_SIZE,
        this.#swordHitbox.x,
        this.#swordHitbox.y,
        TILE_SIZE, TILE_SIZE
      );
      if (DEBUG) Renderer.vrect(this.#swordHitbox.pos, this.#swordHitbox.dim);
    }
    // Draw protective shield
    if (this.status & Player.SECONDARY_FLAG) {
      Renderer.image(
        "spritesheet",
        0, 80, TILE_SIZE, TILE_SIZE,
        this.dst.x,
        this.dst.y,
        TILE_SIZE, TILE_SIZE
      );
    }
  }

  hurt(dmg=1) {
    if (!(this.status & Player.SECONDARY_FLAG)) super.hurt(dmg);
  }

  powerup() {
    this.vel.x = this.vel.x + 10 >= 100
      ? 100
      : this.vel.x + 10;
    this.vel.y = this.vel.y + 10 >= 100
      ? 100
      : this.vel.y + 10;
  }
};