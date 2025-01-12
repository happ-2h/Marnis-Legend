import Tile from "../Tile";

export default class Tile_Stone extends Tile {
  /**
   * @param {Number} x   - x-position of the tile
   * @param {Number} y   - y-position of the tile
   * @param {String} map - Map entity belongs to
   */
  constructor(x=0, y=0, map=null) {
    super(x, y, 21, true, map);

    this.zindex = 1;
  }
};