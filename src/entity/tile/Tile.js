import Entity    from "../Entity";
import Renderer  from "../../gfx/Renderer";
import { DEBUG } from "../../game/constants";

export default class Tile extends Entity {
  #type;    // Tile type
  #isSolid; // If the tile is solid

  /**
   * @param {Number}  x     - x-position of the tile
   * @param {Number}  y     - y-position of the tile
   * @param {Number}  type  - Type of tile (ID placement in spritesheet)
   * @param {Boolean} solid - Should it be considered for collisions
   * @param {String}  map   - Map entity belongs to
   */
  constructor(x=0, y=0, type=0, solid=true, map=null) {
    super(x, y, map);

    this.src.x = (type&0xF)<<4;
    this.src.y = (type>>4)<<4;

    this.#type = type;
    this.#isSolid = solid;
  }

  init() {}

  update(dt) {}

  draw() {
    Renderer.vimage("spritesheet", this.src, this.dst);

    if (DEBUG) Renderer.vrect(this.dst.pos, this.dst.dim);
  }

  get type()    { return this.#type; }
  get isSolid() { return this.#isSolid; }
};