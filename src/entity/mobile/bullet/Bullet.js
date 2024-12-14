import { TILE_SIZE } from "../../../game/constants";
import Rectangle from "../../../utils/Rectangle";
import Entity_Mob from "../Entity_Mob";

export default class Bullet extends Entity_Mob {
  #hitbox;

  constructor(x=0, y=0) {
    super(x, y, null);

    this.#hitbox = new Rectangle(0, 0, TILE_SIZE>>1, TILE_SIZE>>1);
  }
};