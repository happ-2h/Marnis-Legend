import Camera from "../camera/Camera";
import Enemy_Mage from "../entity/mobile/enemy/mage/Enemy_Mage";
import Knight from "../entity/mobile/player/knight/Knight";
import Renderer from "../gfx/Renderer";
import AssetHandler from "../utils/AssetHandler";
import { CANVAS_HEIGHT, CANVAS_WIDTH, DEBUG } from "./constants";
import GameState from "./state/GameState";
import StateHandler from "./state/StateHandler";

export default class Game {
  #cnv;  // HTML canvas reference
  #last; // Previous RAF timestamp

  constructor() {
    // Init canvas
    this.#cnv = document.querySelector("canvas");
    this.#cnv.width  = CANVAS_WIDTH;
    this.#cnv.height = CANVAS_HEIGHT;
    this.#cnv.autofocus = true;

    this.#last = 0;

    // Poll assets
    // - Images
    AssetHandler.poll("spritesheet", "spritesheet.png");
    // - Maps
    AssetHandler.poll("test_map", "test_map.json");

    AssetHandler.load()
      .then(val => this.init())
      .catch(err => console.error(err));
  }

  init() {
    Renderer.init(this.#cnv.getContext("2d", { alpha: false }));

    StateHandler.push(new GameState);

    this.#last = performance.now();
    this.update(this.#last);
  }

  update(ts) {
    const dt = (ts - this.#last) / 1000;
    this.#last = ts;

    requestAnimationFrame(this.update.bind(this));

    StateHandler.update(dt);

    this.render(dt);
  }

  render(dt) {
    Renderer.clear(this.#cnv.width, this.#cnv.height);

    StateHandler.render();

    if (DEBUG) Renderer.text(1/dt, 32, 32, "red");
  }
};