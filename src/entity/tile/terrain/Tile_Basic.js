import Tile from "../Tile";

export default class Tile_Basic extends Tile {
  constructor(x=0, y=0, z=0, type=0, solid=true, map=null) {
    super(x, y, type, solid, map);

    this.zindex = z;
  }
};