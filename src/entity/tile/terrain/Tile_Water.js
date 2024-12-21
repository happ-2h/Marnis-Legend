import Animation from "../../../gfx/Animation";
import Tile from "../Tile";

export default class Tile_Water extends Tile {
  constructor(x=0, y=0, map=null) {
    super(x, y, 17, true, map);

    this.zindex = 0;

    this.animation = new Animation([17, 19], 30);
  }

  update(gos, dt) {
    this.animation.update(dt);
    this.src.pos.set(
      (this.animation.currentFrame&0xF)<<4,
      (this.animation.currentFrame>>4)<<4
    );
  }
};