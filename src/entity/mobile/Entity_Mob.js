import Renderer from "../../gfx/Renderer";
import Entity from "../Entity";
import { DEBUG } from "../../game/constants";
import Vec2D from "../../math/Vec2D";

export default class Entity_Mob extends Entity {
  #controller; // Movement handler

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

  // Accessors
  get controller() { return this.#controller; }

  // Mutators
  set controller(controller) {
    this.#controller = controller;
  }
};