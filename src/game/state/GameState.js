import Camera from "../../camera/Camera";
import Enemy_Mage from "../../entity/mobile/enemy/mage/Enemy_Mage";
import Knight from "../../entity/mobile/player/knight/Knight";
import Player from "../../entity/mobile/player/Player";
import Renderer from "../../gfx/Renderer";
import MapHandler from "../../map/MapHandler";
import Rectangle from "../../utils/Rectangle";
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

    this.gameObjects.push(new Knight(
      3<<4,
      (mapRef.height-2)<<4
    ));
    this.gameObjects.push(new Enemy_Mage(
      32,
      (mapRef.height-6)<<4
    ));
    this.camera = new Camera(
      0,
      (mapRef.height-14)<<4
    );
  }

  update(dt) {
    this.gameObjects.forEach(go => {
      // TODO and is player 1
      if (go instanceof Player) {
        go.update(dt);
        this.camera.vfocus(go.dst);
        this.camera.update(dt);
      }
      else go.update(dt);
    });
  }

  render() {
    Renderer.setOffset(this.camera.x, this.camera.y);

    MapHandler.drawMap(this.map, new Rectangle(this.camera.x, this.camera.y, 16, 14));

    this.gameObjects
      .sort((a, b) => a.dst.pos.y - b.dst.pos.y)
      .forEach(go => go.draw());
  }
};