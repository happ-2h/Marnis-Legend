import Pickup from "./Pickup";

export default class PU_Health extends Pickup {
  constructor(x=0, y=0, map=null) {
    super(x, y, [82, 83, 84, 84], 5, map);
  }

  effect(entity=null) {
    entity.hp =
      entity.hp + 2 >= entity.maxHp
        ? entity.maxHp
        : entity.hp + 2;
  }
};