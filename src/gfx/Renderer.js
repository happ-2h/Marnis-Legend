import { SCALE } from "../game/constants";
import TextureHandler from "./TextureHandler";

let instance = null;

class _Renderer {
  /**@type {CanvasRenderingContext2D} */
  #ctx; // Drawing context reference

  constructor() {
    if (instance) throw new Error("Renderer singleton reconstructed");

    this.#ctx = null;

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
      Math.floor(dx * SCALE),
      Math.floor(dy * SCALE),
      dw * SCALE,
      dh * SCALE
    );
  }

  // Vec2D functions
  vrect(pos=null, dim=null, color="red") {
    this.#ctx.strokeStyle = color;
    this.#ctx.strokeRect(
      Math.floor(pos.x * SCALE),
      Math.floor(pos.y * SCALE),
      dim.x * SCALE,
      dim.y * SCALE
    );
  }

  vimage(textureID, src, dst) {
    this.#ctx.drawImage(
      TextureHandler.getTexture(textureID),
      src.pos.x, src.pos.y, src.dim.x, src.dim.y,
      Math.floor(dst.pos.x * SCALE),
      Math.floor(dst.pos.y * SCALE),
      dst.dim.x * SCALE,
      dst.dim.y * SCALE
    );
  }
};

const Renderer = new _Renderer;
export default Renderer;