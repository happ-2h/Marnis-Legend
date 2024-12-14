import Player from "../player/Player";
import Bullet from "./Bullet";

export default class Bullet_MagicSpear extends Bullet {
  constructor(x=0, y=0) {
    super(x, y);

    this.src.x = 0;
    this.src.y = 48;
    this.src.w = 8;
    this.dst.w = 8;

    this.vel.set(0, 75);
  }

  update(gos, dt) {
    const nexty = this.dst.y + this.vel.y * dt;

    this.dst.y = nexty;

    gos.forEach(go => {
      if (go instanceof Player) {
        if (this.dst.intersects(go.hitboxAdj())) {
          this.kill();
        }
      }
    });
  }
};