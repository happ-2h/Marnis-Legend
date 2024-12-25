import { SCREEN_HEIGHT_TILES } from "../../../../game/constants";
import Animation from "../../../../gfx/Animation";
import Player from "../../player/Player";
import Enemy from "../Enemy";

export default class Enemy_Slime extends Enemy {
  constructor(x=0, y=0, map=null) {
    super(x, y, null, map);

    this.src.x = 32;
    this.src.y = 32;

    this.vel.set(0, 80);
    this.dir.set(0, 1);
    this.dir.normalize();

    this.hitbox.pos.set(2, 8);
    this.hitbox.dim.set(12, 8);

    this.animation = new Animation([34, 35], 10);
  }

  update(gos, dt) {
    let nexty = this.dst.pos.y + this.vel.y * this.dir.y * dt;

    this.dst.y = nexty;

    gos.forEach(go => {
      if (go instanceof Player) {
        // Hurt player
        if (this.dst.intersects(go.hitboxAdj())) {
          // TODO hurt player
          this.kill();
        }
        // Remove if beyond player + one screen
        if (this.dst.y > go.dst.y + (SCREEN_HEIGHT_TILES<<4)) {
          this.kill();
        }
      }
    });

    this.animation.update(dt);
    this.src.pos.set(
      (this.animation.currentFrame&0xF)<<4,
      (this.animation.currentFrame>>4)<<4
    );
  }
};