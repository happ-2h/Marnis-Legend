import Tile from "../Tile";

export default class Tile_Basic extends Tile {
  /**
   * @param {Number}  x     - x-position of the tile
   * @param {Number}  y     - y-position of the tile
   * @param {Number}  z     - z-position of the tile
   * @param {Number}  type  - Tile type (ID from the spritesheet)
   * @param {Boolean} solid - Should it be considered for collisions
   * @param {String}  map   - Map entity belongs to
   */
  constructor(x=0, y=0, z=0, type=0, solid=true, map=null) {
    super(x, y, type, solid, map);

    this.zindex = z;
  }
};