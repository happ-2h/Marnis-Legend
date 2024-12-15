import { SCREEN_HEIGHT_TILES, SCREEN_WIDTH_TILES, TILE_SIZE } from "../game/constants";
import Renderer from "../gfx/Renderer";
import Vec2D from "../math/Vec2D";
import Rectangle from "../utils/Rectangle";

export default class Map {
  #id;  // Given map ID
  #dim; // Dimensions (width, height)
  #layers; // Layers of map arrays

  constructor(data, mapID) {
    this.#id = mapID;

    this.#dim = new Vec2D(data.width, data.height);

    this.#layers = [ ...data.layers ];
  }

  draw(crop=new Rectangle(0, 0, SCREEN_WIDTH_TILES, SCREEN_HEIGHT_TILES)) {
    // Calculate crop
    let cx = (crop.x>>4);
    let cy = (crop.y>>4);
    let cw = cx + crop.w;
    let ch = cy + crop.h + 1;

    for (let l = 0; l < this.#layers.length; ++l) {
      for (let x = cx; x < cw; ++x) {
        for (let y = cy; y < ch; ++y) {
          const tileID = this.getTileNum(x, y, l);

          if (tileID > 0) {
            Renderer.image(
              "spritesheet",
              (tileID&0xF)<<4,
              (tileID>>4)<<4,
              TILE_SIZE, TILE_SIZE,
              x*TILE_SIZE,
              y*TILE_SIZE,
              TILE_SIZE,
              TILE_SIZE
            );
          }
        }
      }
    }
  }

  getTileNum(x=0, y=0, layer=0) {
    // Floor the input
    x |= 0;
    y |= 0;

    if (x >= 0 && x < this.#dim.x && y >= 0 && y < this.#dim.y)
      return this.#layers[layer].data[x+y*this.#dim.x] - 1;

    return -1;
  }

  // Accessors
  get id()     { return this.#id; }
  get width()  { return this.#dim.x; }
  get height() { return this.#dim.y; }
};