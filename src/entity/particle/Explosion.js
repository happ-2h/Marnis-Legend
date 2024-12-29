import Animation from "../../gfx/Animation";
import Renderer from "../../gfx/Renderer";
import Entity from "../Entity";

export default class Explosion extends Entity {
  constructor(x=0, y=0, animSpeed=0, map=null) {
    super(x, y, map);

    this.zindex = 99;

    this.animation = new Animation([64,65,66,67,68,69,70], animSpeed);
  }

  init() {}

  update(dt) {
    this.animation.update(dt);
    this.src.pos.set(
      (this.animation.currentFrame&0xF)<<4,
      (this.animation.currentFrame>>4)<<4
    );

    if (this.animation.iterations >= 1) this.kill();
  }

  draw() {
    Renderer.vimage("spritesheet", this.src, this.dst);
  }
};