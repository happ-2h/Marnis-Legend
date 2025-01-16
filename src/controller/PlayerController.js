import Controller     from "./Controller";
import GamepadHandler from "../input/gamepad/GamepadHandler";
import KeyHandler     from "../input/KeyHandler";

export default class PlayerController extends Controller {
  constructor() { super(); }

  // Arrow keys
  isRequestingUp(index=0) {
    return KeyHandler.isDown(38) ||
           GamepadHandler.getGamepad(index)?.isDpad_Up ||
           GamepadHandler.getGamepad(index)?.lstick_Up
  }

  isRequestingDown(index=0)  {
    return KeyHandler.isDown(40) ||
           GamepadHandler.getGamepad(index)?.isDpad_Down ||
           GamepadHandler.getGamepad(index)?.lstick_Down
  }

  isRequestingLeft(index=0)  {
    return KeyHandler.isDown(37) ||
           GamepadHandler.getGamepad(index)?.isDpad_Left ||
           GamepadHandler.getGamepad(index)?.lstick_Left
  }

  isRequestingRight(index=0) {
    return KeyHandler.isDown(39) ||
           GamepadHandler.getGamepad(index)?.isDpad_Right ||
           GamepadHandler.getGamepad(index)?.lstick_Right
  }

  // z
  isRequestingA(index=0) {
    return KeyHandler.isDown(90) ||
           GamepadHandler.getGamepad(index)?.actionSouth;
  }

  // x
  isRequestingB(index=0) {
    return KeyHandler.isDown(88) ||
           GamepadHandler.getGamepad(index)?.actionEast;
  }
};