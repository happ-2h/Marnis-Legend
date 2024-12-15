import { SCREEN_HEIGHT_TILES, SCREEN_WIDTH_TILES } from "../game/constants";
import Vec2D from "../math/Vec2D";
import Rectangle from "../utils/Rectangle";

export default class Camera {
  #rect;    // Camera's x, y, width, height
  #focalPt; // Camera's (x, y) focal point

  constructor(x=0, y=0, map=null) {
    this.#rect    = new Rectangle(x, y, SCREEN_WIDTH_TILES, SCREEN_HEIGHT_TILES);
    this.#focalPt = new Vec2D(x, y);
  }

  focus(x, y) {
    this.#focalPt.set(x, y);
  }

  vfocus(vec) {
    this.focus(vec.x, vec.y);
  }

  update(dt) {
    if (this.#focalPt.y <= this.#rect.y + (11<<4))
      --this.#rect.y;

    if (this.#rect.y <= 0) this.#rect.y = 0;
  }

  // Accessors
  get rect()   { return this.#rect; }
  get x()      { return this.rect.pos.x; }
  get y()      { return this.rect.pos.y; }
  get width()  { return this.rect.dim.x; }
  get height() { return this.rect.dim.y; }

  // Mutators
  set x(x)          { this.#rect.x = x; }
  set y(y)          { this.#rect.y = y; }
};