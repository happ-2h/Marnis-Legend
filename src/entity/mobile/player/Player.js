import PlayerController from "../../../controller/PlayerController";
import Entity_Mob from "../Entity_Mob";

export default class Player extends Entity_Mob {
  constructor(x=0, y=0) {
    super(x, y, new PlayerController);

    this.vel.set(100, 100);
  }

  update(dt) {
    if (this.controller.isRequestingLeft()) this.dir.x = -1;
    else if (this.controller.isRequestingRight()) this.dir.x = 1;
    else this.dir.x = 0;

    if (this.controller.isRequestingUp()) this.dir.y = -1;
    else if (this.controller.isRequestingDown()) this.dir.y = 1;
    else this.dir.y = 0;

    this.dir.normalize();

    let nextx = this.dst.x + this.vel.x * this.dir.x * dt;
    let nexty = this.dst.y + this.vel.y * this.dir.y * dt;

    this.dst.x = nextx;
    this.dst.y = nexty;
  }
};