import { SCREEN_HEIGHT_TILES, SCREEN_WIDTH_TILES, TILE_SIZE } from "../game/constants";
import { lerp } from "../math/utils";
import Vec2D from "../math/Vec2D";
import Rectangle from "../utils/Rectangle";

export default class Camera {
  #rect;    // Camera's x, y, width, height
  #focalPt; // Camera's (x, y) focal point

  #lerpSpeed;
  #triggerDistY; // Location when the camera starts moving

  constructor(x=0, y=0, map=null) {
    this.#rect    = new Rectangle(x, y, SCREEN_WIDTH_TILES, SCREEN_HEIGHT_TILES);
    this.#focalPt = new Vec2D(x, y);

    this.#lerpSpeed = 0.16;
    this.#triggerDistY = 11 * TILE_SIZE;
  }

  focus(x, y) {
    this.#focalPt.set(
      Math.floor(x),
      Math.floor(y)
    );
  }

  vfocus(vec) {
    this.focus(vec.x, vec.y);
  }

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
  set x(x)          { this.#rect.x = x; }
  set y(y)          { this.#rect.y = y; }

  set lerpSpeed(ls)   { this.#lerpSpeed = ls; }
  set triggerDistY(y) { this.#triggerDistY = y; }
};