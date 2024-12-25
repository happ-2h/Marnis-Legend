import { TILE_SIZE } from "../../../game/constants";
import Rectangle from "../../../utils/Rectangle";
import Entity_Mob from "../Entity_Mob";

export default class Bullet extends Entity_Mob {
  #hitbox;
  #damage; // Damage inflicted

  constructor(x=0, y=0, dmg=1, map=null) {
    super(x, y, null, map);

    this.#hitbox = new Rectangle(0, 0, TILE_SIZE>>1, TILE_SIZE>>1);

    this.#damage = dmg;
  }

  // Accessors
  get damage() { return this.#damage; }
};