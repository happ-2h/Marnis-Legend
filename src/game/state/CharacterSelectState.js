import Renderer       from "../../gfx/Renderer";
import GamepadHandler from "../../input/gamepad/GamepadHandler";
import KeyHandler     from "../../input/KeyHandler";
import StateHandler   from "./StateHandler";
import State          from "./State";
import GameState      from "./GameState";

import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../constants";

export default class CharacterSelectState extends State {
  #charCurrent; // Currently displayed character
  #chars;       // Character assetIDs container

  #inputDelay;
  #inputTimer;

  constructor() {
    super();

    this.#charCurrent = 0;

    this.#chars = [
      "char_knight",
      "char_archer",
      "char_witch",
      "char_thief"
    ];

    this.#inputDelay = 0.3;
    this.#inputTimer = 0;
  }

  onEnter() { this.init(); }
  onExit()  {}

  init() {}

  update(dt) {
    this.#inputTimer += dt;

    if (this.#inputTimer >= this.#inputDelay) {
      if (KeyHandler.isDown(37) || GamepadHandler.getGamepad(0)?.isDpad_Left) {
        this.#inputTimer = 0;
        this.#charCurrent = (this.#charCurrent-1)&0x3;
      }
      else if (KeyHandler.isDown(39) || GamepadHandler.getGamepad(0)?.isDpad_Right) {
        this.#inputTimer = 0;
        this.#charCurrent = (this.#charCurrent+1)&0x3;
      }
      else if (KeyHandler.isDown(90) || GamepadHandler.getGamepad(0)?.actionSouth) {
        StateHandler.pop();
        StateHandler.push(new GameState(this.#charCurrent));
      }
    }
  }

  render() {
    Renderer.image(
      this.#chars[this.#charCurrent],
      0, 0, SCREEN_WIDTH, SCREEN_HEIGHT,
      0, 0, SCREEN_WIDTH, SCREEN_HEIGHT
    );
  }
};