import Tile from "../entity/tile/Tile";
import { SCREEN_HEIGHT_TILES, SCREEN_WIDTH_TILES, TILE_SIZE } from "../game/constants";
import Renderer from "../gfx/Renderer";
import Vec2D from "../math/Vec2D";
import Rectangle from "../utils/Rectangle";

export default class Map {
  #id;     // Given map ID
  #dim;    // Dimensions (width, height)
  #layers; // Layers of map arrays
  #tiles;  // Tile object container

  constructor(data, mapID) {
    this.#id = mapID;

    this.#dim = new Vec2D(data.width, data.height);
    this.#layers = [ ...data.layers ];
    this.#tiles = new Array(data.height)
      .fill(null)
      .map(() => new Array(data.width).fill(null));

    this.#initTiles();
  }

  #initTiles() {
    if (this.#layers[1]) {
      for (let x = 0; x < this.#dim.x; ++x) {
        for (let y = 0; y < this.#dim.y; ++y) {
          const tileID = this.getTileNum(x, y, 1);

          if (tileID > 0) {
            switch(tileID) {
              case 32: // Mage
              case 34: // Slime
                this.#tiles[y][x] = new Tile(x, y, tileID, false, this.#id);
                break;
            }
          }
        }
      }
    }
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

  drawLayer(crop, layer=0) {
    if (!crop) crop = new Rectangle(0, 0, SCREEN_WIDTH_TILES, SCREEN_HEIGHT_TILES);

    // Crop calculations
    let cx = (crop.x>>4);
    let cy = (crop.y>>4);
    let cw = cx + crop.w;
    let ch = cy + crop.h + 1;

    for (let x = cx; x < cw; ++x) {
      for (let y = cy; y < ch; ++y) {
        const tileID = this.getTileNum(x, y, layer);

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

  getTileNum(x=0, y=0, layer=0) {
    // Floor the input
    x |= 0;
    y |= 0;

    if (x >= 0 && x < this.#dim.x && y >= 0 && y < this.#dim.y)
      return this.#layers[layer].data[x+y*this.#dim.x] - 1;

    return -1;
  }

  getLayer(layer) {
    return this.#layers[layer];
  }

  // Accessors
  get id()     { return this.#id; }
  get width()  { return this.#dim.x; }
  get height() { return this.#dim.y; }
  get tiles()  { return this.#tiles; }
};