import Bullet            from "./Bullet";
import ParticleHandler   from "../../particle/ParticleHandler";
import Vec2D             from "../../../math/Vec2D";
import Enemy             from "../enemy/Enemy";
import Explosion         from "../../particle/Explosion";
import { SCREEN_HEIGHT } from "../../../game/constants";

export default class Bullet_Grenade extends Bullet {
  #startPos; // Position it first spawned

  /**
   * @param {Number} x   - x-position of the bullet
   * @param {Number} y   - y-position of the bullet
   * @param {String} map - Map bullet belongs to
   */
  constructor(x=0, y=0, map=null) {
    super(x, y, 5, map);

    this.#startPos = new Vec2D(x, y);

    this.src.x = 16;
    this.src.y = 80;
    this.src.w =  8;
    this.src.h =  8;
    this.dst.w =  8;
    this.dst.h =  8;

    this.vel.set(0, 200);

    this.dir.set(0, -1);
    this.dir.normalize();
  }

  update(gos, dt) {
    const nexty = this.dst.y + this.vel.y * this.dir.y * dt;

    this.dst.y = nexty;

    gos.forEach(go => {
      if (go instanceof Enemy) {
        if (this.dst.intersects(go.hitboxAdj())) {
          go.hurt(this.damage);
          this.kill();

          ParticleHandler.add(new Explosion(
            this.dst.x-4,
            this.dst.y-10,
            7,
            this.map
          ));
        }
      }
      // Remove if off screen
      if (this.dst.y <= this.#startPos.y - SCREEN_HEIGHT)
        this.kill();
    });
  }
};