import { SCALE } from "../game/constants";
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

  setOffset(x, y) { this.#offset.set(x, y); }

  resetOffset() { this.#offset.reset(); }
};

const Renderer = new _Renderer;
export default Renderer;