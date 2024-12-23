import Animation from "../../../gfx/Animation";
import Tile from "../Tile";

export default class Tile_BasicAnimated extends Tile {
  constructor(x=0, y=0, z=0, type=0, solid=true, animFrames=null, animSpeed=0, map=null) {
    super(x, y, type, solid, map);

    this.zindex = z;

    this.animation = new Animation([...animFrames], animSpeed);
  }

  update(gos, dt) {
    this.animation.update(dt);
    this.src.pos.set(
      (this.animation.currentFrame&0xF)<<4,
      (this.animation.currentFrame>>4)<<4
    );
  }
};