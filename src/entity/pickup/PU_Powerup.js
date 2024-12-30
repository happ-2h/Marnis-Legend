import Pickup from "./Pickup";

export default class PU_Powerup extends Pickup {
  constructor(x=0, y=0, map=null) {
    super(x, y, [85, 86, 87], 5, map);
  }

  effect(entity=null) {
    entity.powerup();
  }
};