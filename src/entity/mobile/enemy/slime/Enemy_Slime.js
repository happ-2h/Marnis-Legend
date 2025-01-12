import Enemy         from "../Enemy";
import PickupHandler from "../../../pickup/PickupHandler";
import Player        from "../../player/Player";
import Animation     from "../../../../gfx/Animation";
import PU_Health     from "../../../pickup/PU_Health";

export default class Enemy_Slime extends Enemy {
  /**
   * @param {Number} x   - x-position of the enemy
   * @param {Number} y   - y-position of the enemy
   * @param {String} map - Map enemy belongs to
   */
  constructor(x=0, y=0, map=null) {
    super(x, y, null, map);

    this.src.x = 32;
    this.src.y = 32;

    this.vel.set(0, 80);
    this.dir.set(0, 1);
    this.dir.normalize();

    this.hitbox.pos.set(2, 8);
    this.hitbox.dim.set(12, 8);

    this.hp = 2;
    this.maxHp = this.hp;

    this.animation = new Animation([34, 35], 10);
  }

  update(gos, dt) {
    let nexty = this.dst.pos.y + this.vel.y * this.dir.y * dt;

    this.dst.y = nexty;

    gos.forEach(go => {
      if (go instanceof Player) {
        // Hurt player
        if (this.dst.intersects(go.hitboxAdj())) {
          go.hurt(this.maxHp<<1);
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

  kill() {
    super.kill();

    PickupHandler.add(new PU_Health(
      this.dst.x,
      this.dst.y,
      this.map
    ));
  }
};