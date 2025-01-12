import Pickup from "./Pickup";

export default class PU_Health extends Pickup {
  /**
   * @param {Number} x   - x-position of the pickup
   * @param {Number} y   - y-position of the pickup
   * @param {String} map - Map pickup belongs to
   */
  constructor(x=0, y=0, map=null) {
    super(x, y, [82, 83, 84, 84], 5, map);
  }

  /**
   * @brief Applies the effect to the given entity
   *
   * @param {Entity} entity - Entity to apply effect
   */
  effect(entity=null) {
    entity.hp =
      entity.hp + 4 >= entity.maxHp
        ? entity.maxHp
        : entity.hp + 4;
  }
};