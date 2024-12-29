import { SCALE, SCREEN_HEIGHT_TILES, SCREEN_WIDTH_TILES, TILE_SIZE } from "../game/constants";
import Vec2D from "../math/Vec2D";
import TextureHandler from "./TextureHandler";

let instance = null;

class _Renderer {
  /**@type {CanvasRenderingContext2D} */
  #ctx;     // Drawing context reference

  #offset;  // Drawing offset
  #epsilon; // Fixes float positioning glitches

  constructor() {
    if (instance) throw new Error("Renderer singleton reconstructed");

    this.#ctx = null;

    this.#offset = Vec2D.zero();
    this.#epsilon = 0.1;

    instance = this;
  }

  init(context2d) {
    if (context2d) {
      this.#ctx = context2d;

      // Init context properties
      this.#ctx.font = "24px Arial";
      this.#ctx.imageSmoothingEnabled = false;
    }
  }

  clear(width=1, height=1) {
    this.#ctx.clearRect(0, 0, width, height);
  }

  text(text="NO TEXT", x=0, y=0, color="black") {
    this.#ctx.fillStyle = color;
    this.#ctx.fillText(text, x, y);
  }

  image(textureID, sx=0, sy=0, sw=TILE_SIZE, sh=TILE_SIZE, dx=0, dy=0, dw=TILE_SIZE, dh=TILE_SIZE) {
    this.#ctx.drawImage(
      TextureHandler.getTexture(textureID),
      sx, sy, sw, sh,
      Math.floor((dx - this.#offset.x + this.#epsilon) * SCALE),
      Math.floor((dy - this.#offset.y + this.#epsilon) * SCALE),
      dw * SCALE,
      dh * SCALE
    );
  }

  /**
   * @brief Draw a basic rectangle
   *
   * @param {Number} x       - X-position
   * @param {Number} y       - Y-position
   * @param {Number} width   - Rectangle width
   * @param {Number} height  - Rectangle height
   * @param {String} color   - Rectangle color
   * @param {Boolean} filled - Filled (true) or stroked (false)
   */
  rect(x=0, y=0, width=0, height=0, color="red", filled=false) {
    if (filled) {
      this.#ctx.fillStyle = color;
      this.#ctx.fillRect(
        Math.floor((x - this.#offset.x + this.#epsilon) * SCALE),
        Math.floor((y - this.#offset.y + this.#epsilon) * SCALE),
        width  * SCALE,
        height * SCALE
      );
    }
    else {
      this.#ctx.strokeStyle = color;
      this.#ctx.strokeRect(
        Math.floor((x - this.#offset.x + this.#epsilon) * SCALE),
        Math.floor((y - this.#offset.y + this.#epsilon) * SCALE),
        width  * SCALE,
        height * SCALE
      );
    }
  }

  // Vec2D functions
  vrect(pos=null, dim=null, color="red") {
    this.#ctx.strokeStyle = color;
    this.#ctx.strokeRect(
      Math.floor((pos.x - this.#offset.x + this.#epsilon) * SCALE),
      Math.floor((pos.y - this.#offset.y + this.#epsilon) * SCALE),
      dim.x * SCALE,
      dim.y * SCALE
    );
  }

  vimage(textureID, src, dst) {
    this.#ctx.drawImage(
      TextureHandler.getTexture(textureID),
      src.pos.x, src.pos.y, src.dim.x, src.dim.y,
      Math.floor((dst.pos.x - this.#offset.x + this.#epsilon) * SCALE),
      Math.floor((dst.pos.y - this.#offset.y + this.#epsilon) * SCALE),
      dst.dim.x * SCALE,
      dst.dim.y * SCALE
    );
  }

  // Utils
  grid(color="white") {
    for (let x = 0; x < SCREEN_WIDTH_TILES; ++x) {
      for (let y = 0; y < SCREEN_HEIGHT_TILES; ++y) {
        this.#ctx.strokeStyle = color;
        this.#ctx.strokeRect(
          x * TILE_SIZE * SCALE,
          y * TILE_SIZE * SCALE,
          TILE_SIZE * SCALE,
          TILE_SIZE * SCALE
        );
      }
    }
  }

  /**
   * @brief Draw text from the given texture
   *
   * @param {String} text      - Text to write
   * @param {Number} startx    - Start screen x-position
   * @param {Number} starty    - Start screen y-position
   * @param {String} textureID - ID of the loaded texture
   */
  drawText(text="none", startx=0, starty=0, textureID="spritesheet") {
    text = text.toLowerCase();

    text.split("").forEach(c => {
      const cCode = c.charCodeAt(0);

      // a - z
      if (cCode >= 97 && cCode <= 122) {
        this.image(
          textureID,
          (cCode - 97)<<3, 240, 8, 8,
          startx, starty, 8, 8
        );

        startx += 8;
      }
      // 0 - 9
      else if (cCode >= 48 && cCode <= 57) {
        this.image(
          textureID,
          (cCode - 48)<<3, 248, 8, 8,
          startx, starty, 8, 8
        );

        startx += 8;
      }
      else if (c === ' ') startx += 8;
      // Special characters
      else {
        switch(c) {
          case '-':
            this.image(
              textureID,
              80, 248, 8, 8,
              startx, starty, 8, 8
            );
            startx += 8;
            break;
        }
      }
    });
  }

  setOffset(x, y) { this.#offset.set(x, y); }

  resetOffset() { this.#offset.reset(); }
};

const Renderer = new _Renderer;
export default Renderer;