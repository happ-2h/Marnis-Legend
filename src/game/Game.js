import Player from "../entity/mobile/player/Player";
import Renderer from "../gfx/Renderer";
import { CANVAS_HEIGHT, CANVAS_WIDTH, DEBUG } from "./constants";

export default class Game {
  #cnv;  // HTML canvas reference
  #last; // Previous RAF timestamp

  constructor() {
    // Init canvas
    this.#cnv = document.querySelector("canvas");
    this.#cnv.width  = CANVAS_WIDTH;
    this.#cnv.height = CANVAS_HEIGHT;
    this.#cnv.autofocus = true;

    this.player = new Player(30, 30);

    this.#last = 0;

    this.init();
  }

  init() {
    Renderer.init(this.#cnv.getContext("2d", { alpha: false }));

    this.#last = performance.now();
    this.update(this.#last);
  }

  update(ts) {
    const dt = (ts - this.#last) / 1000;
    this.#last = ts;

    requestAnimationFrame(this.update.bind(this));

    this.player.update(dt);

    this.render(dt);
  }

  render(dt) {
    Renderer.clear(this.#cnv.width, this.#cnv.height);

    this.player.draw();

    if (DEBUG) Renderer.text(1/dt, 32, 32, "red");
  }
};