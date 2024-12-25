import MapHandler from "../../../map/MapHandler";
import State from "../State";
import Enemy_Mage from "../../../entity/mobile/enemy/mage/Enemy_Mage";
import Enemy_Slime from "../../../entity/mobile/enemy/slime/Enemy_Slime";
import Tile_Stone from "../../../entity/tile/terrain/Tile_Stone";
import Tile_Water from "../../../entity/tile/terrain/Tile_Water";
import Knight from "../../../entity/mobile/player/knight/Knight";
import Camera from "../../../camera/Camera";
import Renderer from "../../../gfx/Renderer";
import Player from "../../../entity/mobile/player/Player";
import Rectangle from "../../../utils/Rectangle";
import Enemy from "../../../entity/mobile/enemy/Enemy";
import Archer from "../../../entity/mobile/player/archer/Archer";
import Mage from "../../../entity/mobile/player/mage/Mage";
import Thief from "../../../entity/mobile/player/thief/Thief";
import Enemy_Mushroom from "../../../entity/mobile/enemy/mushroom/Enemy_Mushroom";
import Enemy_Crow from "../../../entity/mobile/enemy/crow/Enemy_Crow";

import { SCREEN_HEIGHT_TILES, SCREEN_WIDTH_TILES, TILE_SIZE } from "../../constants";
import Tile_Basic from "../../../entity/tile/terrain/Tile_Basic";
import Tile_BasicAnimated from "../../../entity/tile/terrain/Tile_BasicAnimated";
import Boss_Eye from "../../../entity/mobile/enemy/boss/Boss_Eye";

export default class Stage extends State {
  #players; // Container of selected characters
  #status;  // Current status of the stage

  static stageNumber = 0;
  static maxStages   = 1;

  constructor(players=null, map=null) {
    super();

    this.#players = [ ...players ];
    this.#status = "building";

    this.map = map;

    ++Stage.stageNumber;
    this.onEnter();
  }

  onEnter() { this.init(); }
  onExit()  {}

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
        this.gameObjects.push(new Boss_Eye(0, TILE_SIZE<<1, this.map));
        break;
    }

    this.#status = "playing"
  }

  init() {
    this.#build();
  }

  update(dt) {
    for (let i = 0; i < this.gameObjects.length; ++i) {
      const go = this.gameObjects[i];

      if (go instanceof Player) {
        go.update(this.gameObjects, dt);
        this.camera.vfocus(go.dst);
        this.camera.update(dt);
      }
      else {
        // Update if on screen
        if (go.dst.intersects(
          new Rectangle(
            this.camera.x, this.camera.y,
            this.camera.width*TILE_SIZE,
            this.camera.height*TILE_SIZE
          )
        )) {
          go.update(this.gameObjects, dt);
        }
        // Clean up if beyond screen y
        else {
          if (go instanceof Enemy) {
            if (go.dst.y > this.camera.y + (this.camera.height)*TILE_SIZE) {
              go.clean();
            }
          }
        }
      }

      // Clean up dead objects
      if (go.isDead) this.gameObjects.splice(i, 1);
    }

    // TODO boss
    if (this.camera.y === 0)
      this.#status = "boss";
  }

  render() {
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

    this.gameObjects
      .sort((a, b) => a.zindex - b.zindex)
      .forEach(go => go.draw());
  }

  // Accessors
  get status() { return this.#status; }
};