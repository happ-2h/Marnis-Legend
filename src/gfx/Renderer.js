import { SCALE } from "../game/constants";

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
};

const Renderer = new _Renderer;
export default Renderer;