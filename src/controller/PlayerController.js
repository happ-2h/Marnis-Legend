
import KeyHandler     from "../input/KeyHandler";
import Controller     from "./Controller";

export default class PlayerController extends Controller {
  constructor() { super(); }

  // Arrow keys
  isRequestingUp()    { return KeyHandler.isDown(38); }
  isRequestingDown()  { return KeyHandler.isDown(40); }
  isRequestingLeft()  { return KeyHandler.isDown(37); }
  isRequestingRight() { return KeyHandler.isDown(39); }

  // Q
  isRequestingA() { return KeyHandler.isDown(81); }

  // W
  isRequestingB() { return KeyHandler.isDown(87); }
};