import Tile      from "../entity/tile/Tile";
import Renderer  from "../gfx/Renderer";
import Vec2D     from "../math/Vec2D";
import Rectangle from "../utils/Rectangle";

import {
  SCREEN_HEIGHT_TILES,
  SCREEN_WIDTH_TILES,
  TILE_SIZE
} from "../game/constants";

export default class Map {
  #id;     // Given map ID
  #dim;    // Dimensions (width, height)
  #layers; // Layers of map arrays
  #tiles;  // Tile object container

  /**
   * @param {Object} data  - Map data
   * @param {String} mapID - ID to give the map
   */
  constructor(data=null, mapID="") {
    this.#id = mapID;

    this.#dim = new Vec2D(data.width, data.height);
    this.#layers = [ ...data.layers ];
    this.#tiles = new Array(data.height)
      .fill(null)
      .map(() => new Array(data.width).fill(null));

    this.#initTiles();
  }

  /**
   * @brief Convert JSON tile data to game objects
   */
  #initTiles() {
    if (this.#layers[1]) {
      for (let x = 0; x < this.#dim.x; ++x) {
        for (let y = 0; y < this.#dim.y; ++y) {
          const tileID = this.getTileNum(x, y, 1);

          if (tileID > 0) {
            switch(tileID) {
              // Enemies
              case 32: // Mage
              case 34: // Slime
              case 36: // Mushroom
              case 38: // Crow
                this.#tiles[y][x] = new Tile(x, y, tileID, false, this.#id);
                break;
              // Terrain
              case 17: // Water
              case 21: // Stone
              case 30: // Stone square
              case 27: // Dancing mushroom
              case 61: // Inner tree
              case 62: // Inner tree
                this.#tiles[y][x] = new Tile(x, y, tileID, true, this.#id);
                break;
              case 29: // Triple mushroom
              case 44: // Outer tree
              case 45: // Outer tree
              case 46: // Outer tree
              case 47: // Outer tree
              case 60:
              case 63:
              case 76: // Outer tree
              case 77: // Outer tree
              case 78: // Outer tree
              case 79: // Outer tree
                this.#tiles[y][x] = new Tile(x, y, tileID, false, this.#id);
                break;
            }
          }
        }
      }
    }
  }

  /**
   * @brief Draws the map
   *
   * @param {Rectangle} crop - Dimensions to crop the map
   */
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

  /**
   * @brief Draws a single layer of the map
   *
   * @param {Rectangle} crop  - Dimensions to crop the map
   * @param {Number}    layer - Layer number to draw
   */
  drawLayer(crop=null, layer=0) {
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

  /**
   * @brief Get a tile object at (x, y)
   *
   * @param {Number} x - x-coordinate of the tile to get
   * @param {Number} y - y-coordinate of the tile to get
   *
   * @returns Tile object at (x, y) or null if no tile exists
   */
  getTile(x=0, y=0) {
    x |= 0;
    y |= 0;

    return this.#tiles[y][x];
  }

  /**
   * @brief Get a tile's ID/number at (x, y)
   *
   * @param {Number} x     - x-coordinate of the tile to get
   * @param {Number} y     - y-coordinate of the tile to get
   * @param {Number} layer - Layer to get the tile at
   *
   * @returns Tile number/ID at (x, y) or -1 if out-of-bounds
   */
  getTileNum(x=0, y=0, layer=0) {
    // Floor the input
    x |= 0;
    y |= 0;

    if (x >= 0 && x < this.#dim.x && y >= 0 && y < this.#dim.y)
      return this.#layers[layer].data[x+y*this.#dim.x] - 1;

    return -1;
  }

  /**
   * @brief Get the map's layer
   *
   * @param {Number} layer - Layer to get
   *
   * @returns Map data at the specified layer
   */
  getLayer(layer=0) {
    return this.#layers[layer];
  }

  // Accessors
  get id()     { return this.#id; }
  get width()  { return this.#dim.x; }
  get height() { return this.#dim.y; }
  get tiles()  { return this.#tiles; }
};