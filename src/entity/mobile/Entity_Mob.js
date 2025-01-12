import Entity     from "../Entity";
import Renderer   from "../../gfx/Renderer";
import Vec2D      from "../../math/Vec2D";
import Controller from "../../controller/Controller";
import { DEBUG, TILE_SIZE } from "../../game/constants";

export default class Entity_Mob extends Entity {
  #controller; // Movement handler

  /**
   * @param {Number}     x          - x-position of the entity
   * @param {Number}     y          - y-position of the entity
   * @param {Controller} controller - Control handler of the entity
   * @param {String}     map        - Map entity belongs to
   */
  constructor(x=0, y=0, controller=null, map=null) {
    super(x, y, map);

    this.#controller = controller;

    this.zindex = 1;
  }

  init() {}

  update(dt) {}

  draw() {
    Renderer.vimage("spritesheet", this.src, this.dst);

    if (DEBUG) {
      Renderer.vrect(this.dst.pos, this.dst.dim);
      Renderer.vrect(
        Vec2D.add(this.hitbox.pos, this.dst.pos),
        this.hitbox.dim,
        "white"
      );
    }
  }

  /**
   * @brief Draws a HP bar
   *
   * @param {Boolean} onTop - Draw above entity (on y-axis)
   */
  drawHpBar(onTop=false) {
    const width = TILE_SIZE * this.hpPercent();
    const _y = this.dst.y + (onTop ? -6 : 18);

    // Red
    Renderer.image(
      "spritesheet",
      80, 52, 16, 4,
      this.dst.x, _y, 16, 4
    );

    // Green
    Renderer.image(
      "spritesheet",
      80, 48, 16, 4,
      this.dst.x, _y, width, 4
    );
  }

  // Accessors
  get controller() { return this.#controller; }

  // Mutators
  set controller(controller) {
    this.#controller = controller;
  }
};