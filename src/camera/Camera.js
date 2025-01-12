import Rectangle from "../utils/Rectangle";
import Vec2D     from "../math/Vec2D";

import { lerp }  from "../math/utils";
import {
  SCREEN_HEIGHT_TILES,
  SCREEN_WIDTH_TILES,
  TILE_SIZE
} from "../game/constants";

export default class Camera {
  #rect;    // Camera's x, y, width, height
  #focalPt; // Camera's (x, y) focal point

  #lerpSpeed;
  #triggerDistY; // Location when the camera starts moving

  /**
   * @param {Number} x   - Focal x-position
   * @param {Number} y   - Focal y-position
   * @param {String} map - Map camera belongs to
   */
  constructor(x=0, y=0, map=null) {
    this.#rect    = new Rectangle(x, y, SCREEN_WIDTH_TILES, SCREEN_HEIGHT_TILES);
    this.#focalPt = new Vec2D(x, y);

    this.#lerpSpeed = 0.16;
    this.#triggerDistY = 11 * TILE_SIZE;
  }

  /**
   * @brief Focus camera on (x, y)
   *
   * @param {Number} x - x-position to focus on
   * @param {Number} y - y-position to focus on
   */
  focus(x, y) {
    this.#focalPt.set(
      Math.floor(x),
      Math.floor(y)
    );
  }

  /**
   * @brief Focus camera on vector object
   *
   * @param {Vec2D} vec - Vector to focus on
   */
  vfocus(vec) { this.focus(vec.x, vec.y); }

  update(dt) {
    // Move up if focused object is on or above trigger distance
    if (this.#focalPt.y <= this.#rect.y + this.#triggerDistY)
      this.#rect.y = lerp(
        this.#rect.y,
        this.#focalPt.y - this.#triggerDistY,
        this.#lerpSpeed
      );

    if (this.#rect.y <= 0) this.#rect.y = 0;
  }

  // Accessors
  get rect()   { return this.#rect; }
  get x()      { return this.rect.pos.x; }
  get y()      { return this.rect.pos.y; }
  get width()  { return this.rect.dim.x; }
  get height() { return this.rect.dim.y; }

  get lerpSpeed()    { return this.#lerpSpeed; }
  get triggerDistY() { return this.#triggerDistY}

  // Mutators
  set x(x) { this.#rect.x = x; }
  set y(y) { this.#rect.y = y; }

  set lerpSpeed(ls)   { this.#lerpSpeed = ls; }
  set triggerDistY(y) { this.#triggerDistY = y; }
};