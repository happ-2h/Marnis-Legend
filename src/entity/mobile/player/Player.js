import PlayerController from "../../../controller/PlayerController";
import Entity_Mob from "../Entity_Mob";

export default class Player extends Entity_Mob {
  constructor(x=0, y=0) {
    super(x, y, new PlayerController);
  }

  update(dt) {
    if (this.controller.isRequestingLeft())  --this.dst.x;
    if (this.controller.isRequestingRight()) ++this.dst.x;
    if (this.controller.isRequestingUp())    --this.dst.y;
    if (this.controller.isRequestingDown())  ++this.dst.y;
  }
};