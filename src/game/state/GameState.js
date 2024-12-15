import Camera from "../../camera/Camera";
import Enemy from "../../entity/mobile/enemy/Enemy";
import Enemy_Mage from "../../entity/mobile/enemy/mage/Enemy_Mage";
import Archer from "../../entity/mobile/player/archer/Archer";
import Player from "../../entity/mobile/player/Player";
import Renderer from "../../gfx/Renderer";
import MapHandler from "../../map/MapHandler";
import Rectangle from "../../utils/Rectangle";
import { SCREEN_HEIGHT_TILES, SCREEN_WIDTH_TILES, TILE_SIZE } from "../constants";
import State from "./State";

export default class GameState extends State {
  constructor() {
    super();
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
            case 32:
              this.gameObjects.push(new Enemy_Mage(
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

    this.gameObjects.push(new Archer(
      3<<4,
      (mapRef.height-2)<<4
    ));
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
            if (go.dst.y > this.camera.y + (this.camera.height + 2)*TILE_SIZE) {
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
      .sort((a, b) => a.dst.pos.y - b.dst.pos.y)
      .forEach(go => go.draw());
  }
};