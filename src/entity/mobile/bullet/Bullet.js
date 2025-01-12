import Entity_Mob    from "../Entity_Mob";
import Rectangle     from "../../../utils/Rectangle";
import { TILE_SIZE } from "../../../game/constants";

export default class Bullet extends Entity_Mob {
  #hitbox;
  #damage; // Damage inflicted

  /**
   * @param {Number} x   - x-position of the entity
   * @param {Number} y   - y-position of the entity
   * @param {Number} dmg - Damage dealt
   * @param {String} map - Map entity belongs to
   */
  constructor(x=0, y=0, dmg=1, map=null) {
    super(x, y, null, map);

    this.#hitbox = new Rectangle(0, 0, TILE_SIZE>>1, TILE_SIZE>>1);

    this.#damage = dmg;
  }

  // Accessors
  get damage() { return this.#damage; }
};