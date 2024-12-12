import Renderer from "../../gfx/Renderer";
import Entity from "../Entity";

export default class Entity_Mob extends Entity {
  constructor(x=0, y=0) {
    super(x, y);
  }

  init() {}

  update(dt) {}

  draw() {
    if (DEBUG) Renderer.vrect(this.dst.pos, this.dst.dim);
  }
};