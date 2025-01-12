import Tile      from "../Tile";
import Animation from "../../../gfx/Animation";

export default class Tile_Water extends Tile {
  /**
   * @param {Number} x   - x-position of the tile
   * @param {Number} y   - y-position of the tile
   * @param {String} map - Map entity belongs to
   */
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