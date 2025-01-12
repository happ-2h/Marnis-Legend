import Tile      from "../Tile";
import Animation from "../../../gfx/Animation";

export default class Tile_BasicAnimated extends Tile {
  /**
   * @param {Number}  x          - x-position of the tile
   * @param {Number}  y          - y-position of the tile
   * @param {Number}  z          - z-position of the tile
   * @param {Number}  type       - Tile type (ID from the spritesheet)
   * @param {Boolean} solid      - Should it be considered for collisions
   * @param {Array}   animFrames - Animation frames (tile IDs)
   * @param {Number}  animSpeed  - Animation speed
   * @param {String}  map        - Map entity belongs to
   */
  constructor(x=0, y=0, z=0, type=0, solid=true, animFrames=null, animSpeed=0, map=null) {
    super(x, y, type, solid, map);

    this.zindex = z;

    this.animation = new Animation([...animFrames], animSpeed);
  }

  /**
   * @param {Array}  gos - Game objects
   * @param {Number} dt  - Delta time
   */
  update(gos, dt) {
    this.animation.update(dt);
    this.src.pos.set(
      (this.animation.currentFrame&0xF)<<4,
      (this.animation.currentFrame>>4)<<4
    );
  }
};