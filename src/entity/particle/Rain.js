import Animation from "../../gfx/Animation";
import Renderer from "../../gfx/Renderer";
import Entity from "../Entity";

export default class Rain extends Entity {
  constructor(x=0, y=0, animSpeed=0, map=null) {
    super(x, y, map);

    this.zindex = 99;

    this.src.w = 8;
    this.src.h = 8;
    this.dst.w = 8;
    this.dst.h = 8;

    this.animation = new Animation(
      [348, 349, 350, 351, 380, 381, 382, 383],
      animSpeed
    );
  }

  init() {}

  update(dt) {
    this.animation.update(dt);
    this.src.pos.set(
      (this.animation.currentFrame%32)<<3,
      (this.animation.currentFrame>>5)<<3
    );
  }

  draw() {
    Renderer.vimage("spritesheet", this.src, this.dst);
  }
};