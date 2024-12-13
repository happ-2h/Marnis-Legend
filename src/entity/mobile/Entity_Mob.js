import Renderer from "../../gfx/Renderer";
import Entity from "../Entity";

import { DEBUG } from "../../game/constants";

export default class Entity_Mob extends Entity {
  #controller; // Movement handler

  constructor(x=0, y=0, controller=null) {
    super(x, y);

    this.#controller = controller;
  }

  init() {}

  update(dt) {}

  draw() {
    Renderer.vimage("spritesheet", this.src, this.dst);

    if (DEBUG) Renderer.vrect(this.dst.pos, this.dst.dim);
  }

  // Accessors
  get controller() { return this.#controller; }

  // Mutators
  set controller(controller) {
    this.#controller = controller;
  }
};