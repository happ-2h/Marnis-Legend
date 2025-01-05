import Renderer from "../../gfx/Renderer";
import State from "./State";
import { DEBUG, SCREEN_WIDTH_TILES } from "../constants";
import AudioHandler from "../../audio/AudioHandler";
import Tile from "../../entity/tile/Tile";
import ParticleHandler from "../../entity/particle/ParticleHandler";
import Rain from "../../entity/particle/Rain";

export default class EndState extends State {
  #frames; // Number of frames the update method has been called

  constructor() {
    super();
    this.#frames = 0;
  }

  onEnter() {
    this.init();

    AudioHandler.setVolume("stage02", 0.4);
    AudioHandler.setPlaybackRate("stage02", 0.6);
    AudioHandler.playMusic("stage02");
  }
  onExit()  {}

  init() {
    let _x = 44;
    let _y = 52;
    let i = 0;

    "thank you for playing".split('').forEach(c => {
      const t = new Tile(_x, _y + 8 * Math.sin(i++));

      t.src.x = (c.charCodeAt(0) - 'a'.charCodeAt(0))<<3;
      t.src.y = 240;
      t.src.w = 8;
      t.src.h = 8;
      t.dst.w = 8;
      t.dst.h = 8;
      t.dir.y = i;

      this.gameObjects.push(t);

      _x += 8;
    });

    for (let i = 0; i < (SCREEN_WIDTH_TILES-5)<<1; ++i) {
      ParticleHandler.add(new Rain(5 + i<<3, (4*16),      2));
      ParticleHandler.add(new Rain(5 + i<<3, (3*16) + 8,  2));
      ParticleHandler.add(new Rain(5 + i<<3, (3*16) + 24, 2));
      ParticleHandler.add(new Rain(5 + i<<3, (3*16) + 32, 2));
    }
  }

  update(dt) {
    for (let i = 0; i < this.gameObjects.length; ++i) {
      const go = this.gameObjects[i];

      go.dst.y = (52 + 4 * Math.sin(go.dir.y + ++this.#frames/200));
    }

    ParticleHandler.update(dt);
  }

  render() {
    // Renderer.drawText("thank you for playing", 44, 52, "spritesheet");
    this.gameObjects.forEach(go => go.draw());
    ParticleHandler.draw();

    if (DEBUG) Renderer.grid("white");
  }
};