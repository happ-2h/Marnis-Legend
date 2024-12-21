import Camera from "../../camera/Camera";
import Enemy_Crow from "../../entity/mobile/enemy/crow/Enemy_Crow";
import Enemy from "../../entity/mobile/enemy/Enemy";
import Enemy_Mage from "../../entity/mobile/enemy/mage/Enemy_Mage";
import Enemy_Mushroom from "../../entity/mobile/enemy/mushroom/Enemy_Mushroom";
import Enemy_Slime from "../../entity/mobile/enemy/slime/Enemy_Slime";
import Archer from "../../entity/mobile/player/archer/Archer";
import Knight from "../../entity/mobile/player/knight/Knight";
import Mage from "../../entity/mobile/player/mage/Mage";
import Player from "../../entity/mobile/player/Player";
import Thief from "../../entity/mobile/player/thief/Thief";
import Tile_Stone from "../../entity/tile/terrain/Tile_Stone";
import Tile_Water from "../../entity/tile/terrain/Tile_Water";
import Renderer from "../../gfx/Renderer";
import MapHandler from "../../map/MapHandler";
import Rectangle from "../../utils/Rectangle";
import { SCREEN_HEIGHT_TILES, SCREEN_WIDTH_TILES, TILE_SIZE } from "../constants";
import State from "./State";

export default class GameState extends State {
  #selectedChar; // From character select screen

  constructor(selectedChar=0) {
    super();

    this.#selectedChar = selectedChar;
  }

  onEnter() { this.init(); }
  onExit()  {}

  init() {
    this.map = "test_map";

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

    switch(this.#selectedChar) {
      default: // Or case 0
        this.gameObjects.push(new Knight(
          3<<4,
          (mapRef.height-2)<<4,
          this.map
        ));
        break;
      case 1:
        this.gameObjects.push(new Archer(
          3<<4,
          (mapRef.height-2)<<4,
          this.map
        ));
        break;
      case 2:
        this.gameObjects.push(new Mage(
          3<<4,
          (mapRef.height-2)<<4,
          this.map
        ));
        break;
      case 3:
        this.gameObjects.push(new Thief(
          3<<4,
          (mapRef.height-2)<<4,
          this.map
        ));
        break;
    }
    this.camera = new Camera(
      0,
      (mapRef.height-SCREEN_HEIGHT_TILES)<<4
    );
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
};