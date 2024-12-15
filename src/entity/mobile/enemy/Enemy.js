import Entity_Mob from "../Entity_Mob";

export default class Enemy extends Entity_Mob {
  constructor(x=0, y=0, controller=null, map=null) {
    super(x, y, controller, map);
  }

  clean() {}
};