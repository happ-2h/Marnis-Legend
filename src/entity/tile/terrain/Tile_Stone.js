import Tile from "../Tile";

export default class Tile_Stone extends Tile {
  constructor(x=0, y=0, map=null) {
    super(x, y, 21, true, map);

    this.zindex = 1;
  }
};