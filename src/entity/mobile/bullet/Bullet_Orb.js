import Bullet from "./Bullet";
import Player from "../player/Player";
import Enemy  from "../enemy/Enemy";

import { SCREEN_HEIGHT_TILES, SCREEN_WIDTH } from "../../../game/constants";

export default class Bullet_Orb extends Bullet {
  /**
   * @param {Number} x   - x-position  of the bullet
   * @param {Number} y   - y-position  of the bullet
   * @param {Number} dx  - x-direction of the bullet
   * @param {Number} dy  - y-direction of the bullet
   * @param {Number} dmg - Damage dealt
   * @param {String} map - Map bullet belongs to
   */
  constructor(x=0, y=0, dx=0, dy=0, dmg=1, map=null) {
    super(x, y, dmg, map);

    this.src.x = 32;
    this.src.y = 48;
    this.src.w =  8;
    this.src.h =  8;
    this.dst.w =  8;
    this.dst.h =  8;

    this.vel.set(100, 100);

    this.dir.set(dx, dy);
    this.dir.normalize();
  }

  update(gos, dt) {
    const nextx = this.dst.x + this.vel.x * this.dir.x * dt;
    const nexty = this.dst.y + this.vel.y * this.dir.y * dt;

    this.dst.x = nextx;
    this.dst.y = nexty;

    gos.forEach(go => {
      if (go instanceof Player) {
        // Check if bullet is out of screen-y
        if (
          this.dst.y < go.dst.y - (SCREEN_HEIGHT_TILES<<4) ||
          this.dst.y > go.dst.y + (SCREEN_HEIGHT_TILES<<2)
        ) this.kill();
      }
      else if (
        go instanceof Enemy &&
        this.dst.intersects(go.hitboxAdj())
      ) {
        go.hurt(this.damage);
        this.kill();
      }
    });

    if (this.dst.x <= -this.dst.w) this.kill();
    if (this.dst.x >= SCREEN_WIDTH) this.kill();
  }
};