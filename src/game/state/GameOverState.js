import AudioHandler from "../../audio/AudioHandler";
import ParticleHandler from "../../entity/particle/ParticleHandler";
import Star from "../../entity/particle/Star";
import Tile from "../../entity/tile/Tile";
import Renderer from "../../gfx/Renderer";
import { rand } from "../../math/utils";
import { DEBUG, SCREEN_HEIGHT, SCREEN_WIDTH, TILE_SIZE } from "../constants";
import State from "./State";

export default class GameOverState extends State {
  constructor() {
    super();
  }

  onEnter() {
    this.init();
    AudioHandler.setVolume("gameoverscreen", 0.4);
    AudioHandler.playMusic("gameoverscreen");
  }
  onExit() {}

  init() {
    let _x = SCREEN_WIDTH;
    let _y = 52;

    "game over".split('').forEach(c => {
      const t = new Tile(_x, _y);

      t.src.x = (c.charCodeAt(0) - 'a'.charCodeAt(0))<<3;
      t.src.y = 240;
      t.src.w = 8;
      t.src.h = 8;
      t.dst.w = 8;
      t.dst.h = 8;

      t.vel.set(100, 100);
      t.dir.set(-1, 0);

      t.firstHit = false;

      t.update = (dt) => {
        t.dir.normalize();

        let nextx = t.dst.x + t.vel.x * t.dir.x * dt;
        let nexty = t.dst.y + t.vel.y * t.dir.y * dt;

        let hit = 0;

        if (nextx <= TILE_SIZE) {
          if (!t.firstHit) t.dir.y = 1;

          t.firstHit = true;
          nextx = 16;
          t.dir.x = 1;
          hit = 1;
        }
        else if (t.firstHit && nextx >= SCREEN_WIDTH - TILE_SIZE - 8) {
          nextx = SCREEN_WIDTH - TILE_SIZE - 8;
          t.dir.x = -1;
          hit = 2;
        }

        if (nexty >= SCREEN_HEIGHT - TILE_SIZE - 8) {
          nexty = SCREEN_HEIGHT - TILE_SIZE - 8;
          t.dir.y = -1;
          hit = 3;
        }
        else if (nexty <= TILE_SIZE) {
          nexty = TILE_SIZE;
          t.dir.y = 1;
          hit = 4;
        }

        t.dst.x = nextx;
        t.dst.y = nexty;

        if (hit) {
          for (let i = 0; i < 5; ++i) {
            let x = t.dst.x;
            let y = t.dst.y + 2;
            let dx = Math.cos(rand(0.1, 10));
            let dy = Math.sin(rand(0.1, 10));

            switch(hit) {
              case 2: x += 6; break;
              case 3:
                x += 2;
                y += 4;
                break;
              case 4:
                x += 2;
                y -= 4;
                break;
            }

            ParticleHandler.add(new Star(x, y, dx, dy));
          }

        }
      };

      this.gameObjects.push(t);

      _x += 8;
    });
  }

  update(dt) {
    this.gameObjects.forEach(go => go.update(dt));

    ParticleHandler.update(dt);
  }

  render() {
    this.gameObjects.forEach(go => go.draw());

    ParticleHandler.draw();

    if (DEBUG) Renderer.grid("white");
  }
};