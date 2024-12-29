import { TILE_SIZE } from "../game/constants";
import Vec2D from "../math/Vec2D";
import Rectangle from "../utils/Rectangle";

export default class Entity {
  #dst;    // Destination rectangle
  #src;    // Blit image source rectangle

  #map;    // Map entity belongs to
  #zindex; // Which layer to draw entity on

  // Physics
  #dir;    // Directional vector
  #accel;  // Acceleration vector
  #vel;    // Velocity vector

  // Collision
  #isDead; // Flag entity as unusable
  #hitbox;
  #block;  // Block movement if colliding

  // Animations
  #animation;

  // Status points
  #hp;     // Health points
  #maxHp;  // Starting health points

  constructor(x=0, y=0, map=null) {
    if (this.constructor === Entity)
      throw new Error("Can't instantiate abstract class Entity");

    // Required abstract methods
    if (this.init === undefined)
      throw new Error("init() must be implemented");
    if (this.update === undefined)
      throw new Error("update(dt) must be implemented");
    if (this.draw === undefined)
      throw new Error("draw() must be implemented");

    this.#dst = new Rectangle(x, y, TILE_SIZE, TILE_SIZE);
    this.#src = new Rectangle(0, 0, TILE_SIZE, TILE_SIZE);

    this.#map = map;
    this.#zindex = 0;

    this.#dir   = Vec2D.zero();
    this.#accel = Vec2D.zero();
    this.#vel   = Vec2D.zero();

    this.#isDead = false;
    this.#hitbox = new Rectangle(x, y, TILE_SIZE, TILE_SIZE);
    this.#block  = false;

    this.#animation = null;

    this.#hp = 1;
    this.#maxHp = this.#hp;
  }

  hurt(dmg=1) {
    this.#hp -= dmg;

    if (this.#hp <= 0) {
      this.#hp = 0;
      this.kill();
    }
  }

  hpPercent() { return this.#hp / this.#maxHp; }

  kill() { this.#isDead = true; }

  /**
   * @brief Adjusts the hitbox to the entity world position\
   *        Does not modfy the hitbox
   *
   * @returns Adjusted rectangle
   */
  hitboxAdj() {
    return new Rectangle(
      this.#dst.x + this.#hitbox.x,
      this.#dst.y + this.#hitbox.y,
      this.#hitbox.w,
      this.#hitbox.h
    );
  }

  // Accessors
  get dst()   { return this.#dst; }
  get src()   { return this.#src; }

  get map()   { return this.#map; }

  get dir()   { return this.#dir; }
  get accel() { return this.#accel; }
  get vel()   { return this.#vel; }

  get isDead() { return this.#isDead; }
  get hitbox() { return this.#hitbox; }
  get zindex() { return this.#zindex; }
  get block()  { return this.#block; }

  get animation() { return this.#animation; }

  get hp()     { return this.#hp; }
  get maxHp()  { return this.#maxHp; }

  // Mutators
  set dst(dst) { this.#dst = dst; }
  set src(src) { this.#src = src; }

  set map(map)  { this.#map = map; }
  set zindex(z) { this.#zindex = z; }
  set block(b)  { this.#block = b; }
  set isDead(d) { this.#isDead = d; }

  set animation(animation) { this.#animation = animation; }

  set hp(hp)     { this.#hp = hp; }
  set maxHp(mhp) { this.#maxHp = mhp; }
};