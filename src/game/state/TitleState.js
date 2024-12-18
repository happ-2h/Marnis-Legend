import Renderer from "../../gfx/Renderer";
import GamepadHandler from "../../input/gamepad/GamepadHandler";
import KeyHandler from "../../input/KeyHandler";
import { DEBUG } from "../constants";
import GameState from "./GameState";
import State from "./State";
import StateHandler from "./StateHandler";

export default class TitleState extends State {
  constructor() {
    super();
  }

  onEnter() { this.init(); }
  onExit()  {}

  init() {}

  update(dt) {
    if (KeyHandler.isDown(81) || GamepadHandler.getGamepad(0)?.start) {
      StateHandler.pop();
      StateHandler.push(new GameState);
    }
  }

  render() {
    Renderer.drawText("marnis Legend", 76, 52);

    // GitHub logo
    Renderer.image(
      "spritesheet",
      0, 232, 8, 8,
      96,
      132,
      8,
      8
    );

    Renderer.drawText("happ-2h", 104, 132);

    Renderer.drawText("press start", 84, 164);

    if (DEBUG) Renderer.grid();
  }
};