import Renderer from "../gfx/Renderer";
import GamepadHandler from "../input/gamepad/GamepadHandler";
import AssetHandler from "../utils/AssetHandler";
import { CANVAS_HEIGHT, CANVAS_WIDTH, DEBUG } from "./constants";
import StateHandler from "./state/StateHandler";
import TitleState from "./state/TitleState";

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
    AssetHandler.poll("char_knight", "charselect/knight.png");
    AssetHandler.poll("char_archer", "charselect/archer.png");
    AssetHandler.poll("char_witch",  "charselect/witch.png");
    AssetHandler.poll("char_thief",  "charselect/thief.png");
    // - Maps
    AssetHandler.poll("stage01", "/stage/stage01.json");
    AssetHandler.poll("stage02", "/stage/stage02.json");
    // - Sounds
    // -- Music
    AssetHandler.poll("startscreen", "music/startscreen.ogg");
    AssetHandler.poll("stage01", "music/stage01.ogg");
    AssetHandler.poll("stage02", "music/stage02.ogg");
    AssetHandler.poll("gameoverscreen", "music/gameoverscreen.ogg");
    // -- SFX
    AssetHandler.poll("drumhit", "sfx/hit_drum.wav");
    AssetHandler.poll("cryEye", "sfx/cry_bossEye.wav");
    AssetHandler.poll("cryDrummer", "sfx/cry_drummer.wav");

    AssetHandler.load()
      .then(val => this.init())
      .catch(err => console.error(err));
  }

  init() {
    Renderer.init(this.#cnv.getContext("2d", { alpha: false }));

    StateHandler.push(new TitleState);

    this.#last = performance.now();
    this.update(this.#last);
  }

  update(ts) {
    const dt = (ts - this.#last) / 1000;
    this.#last = ts;

    requestAnimationFrame(this.update.bind(this));

    GamepadHandler.update();

    StateHandler.update(dt);

    this.render(dt);
  }

  render(dt) {
    Renderer.clear(this.#cnv.width, this.#cnv.height);

    StateHandler.render();

    if (DEBUG) Renderer.text(1/dt, 32, 32, "red");
  }
};