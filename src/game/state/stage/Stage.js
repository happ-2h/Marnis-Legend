import Renderer           from "../../../gfx/Renderer";
import AudioHandler       from "../../../audio/AudioHandler";
import MapHandler         from "../../../map/MapHandler";
import ParticleHandler    from "../../../entity/particle/ParticleHandler";
import PickupHandler      from "../../../entity/pickup/PickupHandler";
import Camera             from "../../../camera/Camera";
import Map                from "../../../map/Map";
import Rectangle          from "../../../utils/Rectangle";
import State              from "../State";
import Player             from "../../../entity/mobile/player/Player";
import Knight             from "../../../entity/mobile/player/knight/Knight";
import Archer             from "../../../entity/mobile/player/archer/Archer";
import Mage               from "../../../entity/mobile/player/mage/Mage";
import Thief              from "../../../entity/mobile/player/thief/Thief";
import Enemy              from "../../../entity/mobile/enemy/Enemy";
import Enemy_Crow         from "../../../entity/mobile/enemy/crow/Enemy_Crow";
import Enemy_Mage         from "../../../entity/mobile/enemy/mage/Enemy_Mage";
import Enemy_Mushroom     from "../../../entity/mobile/enemy/mushroom/Enemy_Mushroom";
import Enemy_Slime        from "../../../entity/mobile/enemy/slime/Enemy_Slime";
import Boss_Drummer       from "../../../entity/mobile/enemy/boss/Boss_Drummer";
import Boss_Eye           from "../../../entity/mobile/enemy/boss/Boss_Eye";
import Tile               from "../../../entity/tile/Tile";
import Tile_Basic         from "../../../entity/tile/terrain/Tile_Basic";
import Tile_BasicAnimated from "../../../entity/tile/terrain/Tile_BasicAnimated";
import Tile_Stone         from "../../../entity/tile/terrain/Tile_Stone";
import Tile_Water         from "../../../entity/tile/terrain/Tile_Water";

import {
  SCREEN_HEIGHT,
  SCREEN_HEIGHT_TILES,
  SCREEN_WIDTH_TILES,
  TILE_SIZE
} from "../../constants";

export default class Stage extends State {
  #players;    // Container of selected characters
  #status;     // Current status of the stage

  #readyDelay; // How long to show stage number screen
  #readyTimer; // Timer showing stage number screen

  static stageNumber = 0;
  static maxStages   = 1;

  /**
   * @param {Array} players - Array of character IDs from character select
   * @param {Map}   map     - Map associated with the stage
   */
  constructor(players=null, map=null) {
    super();

    this.#players = [ ...players ];
    this.#status = "building";

    this.#readyDelay = 2;
    this.#readyTimer = 0;

    this.map = map;

    ++Stage.stageNumber;
    this.onEnter();
  }

  onEnter() {
    this.init();

    // Play music
    AudioHandler.stopAll();
    switch(this.map) {
      case "stage01":
        AudioHandler.setVolume("stage01", 0.5);
        AudioHandler.playMusic("stage01");
        break;
      case "stage02":
        AudioHandler.setVolume("stage02", 0.5);
        AudioHandler.playMusic("stage02");
        break;
    }
  }
  onExit()  {
    ParticleHandler.clear();
    PickupHandler.clear();
  }

  #build() {
    const mapRef = MapHandler.getMap(this.map);

    mapRef.tiles.forEach(row => {
      row.forEach(tile => {
        if (tile) {
          switch(tile.type) {
            // Terrain
            case 17:
              this.gameObjects.push(new Tile_Water(
                tile.dst.pos.x * TILE_SIZE,
                tile.dst.pos.y * TILE_SIZE,
                this.map
              ));
              break;
            case 21:
              this.gameObjects.push(new Tile_Stone(
                tile.dst.pos.x * TILE_SIZE,
                tile.dst.pos.y * TILE_SIZE,
                this.map
              ));
              break;
            case 29:
              this.gameObjects.push(new Tile_Basic(
                tile.dst.pos.x * TILE_SIZE,
                tile.dst.pos.y * TILE_SIZE,
                1, tile.type, false,
                this.map
              ));
              break;
            case 30:
              this.gameObjects.push(new Tile_Basic(
                tile.dst.pos.x * TILE_SIZE,
                tile.dst.pos.y * TILE_SIZE,
                1, tile.type, true,
                this.map
              ));
              break;

            // Tree shrub
            case 44:
            case 45:
            case 46:
            case 47:
            case 60:
            case 63:
            case 76:
            case 77:
            case 78:
            case 79:
              this.gameObjects.push(new Tile_Basic(
                tile.dst.pos.x * TILE_SIZE,
                tile.dst.pos.y * TILE_SIZE,
                2, tile.type, false,
                this.map
              ));
              break;
            case 61:
            case 62:
              this.gameObjects.push(new Tile_Basic(
                tile.dst.pos.x * TILE_SIZE,
                tile.dst.pos.y * TILE_SIZE,
                2, tile.type, true,
                this.map
              ));
              break;
            case 27:
              this.gameObjects.push(new Tile_BasicAnimated(
                tile.dst.pos.x * TILE_SIZE,
                tile.dst.pos.y * TILE_SIZE,
                1, tile.type, true,
                [27, 28], 15,
                this.map
              ));
              break;

            // Enemies
            case 32:
              this.gameObjects.push(new Enemy_Mage(
                tile.dst.pos.x * TILE_SIZE,
                tile.dst.pos.y * TILE_SIZE,
                this.map
              ));
              break;
            case 34:
              this.gameObjects.push(new Enemy_Slime(
                tile.dst.pos.x * TILE_SIZE,
                tile.dst.pos.y * TILE_SIZE,
                this.map
              ));
              break;
            case 36:
              this.gameObjects.push(new Enemy_Mushroom(
                tile.dst.pos.x * TILE_SIZE,
                tile.dst.pos.y * TILE_SIZE,
                this.map
              ));
              break;
            case 38:
              this.gameObjects.push(new Enemy_Crow(
                tile.dst.pos.x * TILE_SIZE,
                tile.dst.pos.y * TILE_SIZE,
                this.map
              ));
              break;

            default: break;
          }
        }
      });
    });

    switch(this.#players[0]) {
      default: // Or case 0
        this.gameObjects.push(new Knight(
          3<<4,
          (mapRef.height-2)<<4,
          1,
          this.map
        ));
        break;
      case 1:
        this.gameObjects.push(new Archer(
          3<<4,
          (mapRef.height-2)<<4,
          1,
          this.map
        ));
        break;
      case 2:
        this.gameObjects.push(new Mage(
          3<<4,
          (mapRef.height-2)<<4,
          1,
          this.map
        ));
        break;
      case 3:
        this.gameObjects.push(new Thief(
          3<<4,
          (mapRef.height-2)<<4,
          1,
          this.map
        ));
        break;
    }

    this.camera = new Camera(
      0,
      (mapRef.height-SCREEN_HEIGHT_TILES)<<4
    );

    // Bosses
    switch(Stage.stageNumber) {
      case 1:
        this.gameObjects.push(new Boss_Eye(7*TILE_SIZE + 8, TILE_SIZE<<1, this.map));
        break;
      case 2:
        this.gameObjects.push(new Boss_Drummer(6*TILE_SIZE + 8, TILE_SIZE<<1, this.map));
        break;
    }

    this.#status = "readyup";
  }

  init() { this.#build(); }

  update(dt) {
    if (this.#status === "readyup") {
      this.#readyTimer += dt;

      if (this.#readyTimer >= this.#readyDelay) this.#status = "playing";
    }
    else {
      for (let i = 0; i < this.gameObjects.length; ++i) {
        const go = this.gameObjects[i];

        if (go instanceof Player) {
          go.update(this.gameObjects, dt);
          this.camera.vfocus(go.dst);
          this.camera.update(dt);
        }
        else {
          // Update if on screen
          if (go.dst.y + go.dst.h - this.camera.y >= 0)
            go.update(this.gameObjects, dt);

          // Clean entities if beyond screen's height
          if (go instanceof Enemy || go instanceof Tile) {
            if (go.dst.y - this.camera.y > SCREEN_HEIGHT) go.kill();
          }
        }

        // Clean up dead objects
        if (go.isDead) {
          if (
            go instanceof Boss_Eye ||
            go instanceof Boss_Drummer
          ) this.#status = "complete";

          this.gameObjects.splice(i, 1);
        }
      }
    }

    ParticleHandler.update(dt);
    PickupHandler.update(dt);
  }

  render() {
    if (this.#status === "readyup")
      Renderer.drawText(`stage ${Stage.stageNumber}`, 6*16+4, (5<<4)+4);
    else {
      Renderer.setOffset(this.camera.x, this.camera.y);

      MapHandler.drawMapLayer(
        this.map,
        new Rectangle(
          this.camera.x,
          this.camera.y,
          SCREEN_WIDTH_TILES,
          SCREEN_HEIGHT_TILES
        ),
        0
      );

      PickupHandler.draw();

      this.gameObjects
        .sort((a, b) => a.zindex - b.zindex)
        .forEach(go => go.draw());
    }

    ParticleHandler.draw();
  }

  // Accessors
  get status() { return this.#status; }
};