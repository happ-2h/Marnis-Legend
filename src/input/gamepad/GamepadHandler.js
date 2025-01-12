import PadController from "./PadController";

let instance = null;

class _GamepadHandler {
  #maxGamepads; // Max accepted gamepads
  #gamepads;    // Connected gamepads container

  constructor() {
    if (instance) throw new Error("GamepadHandler singleton reconstructed");

    this.#maxGamepads = 2;
    this.#gamepads = [];

    addEventListener("gamepadconnected", e => {
      if (this.#gamepads.length + 1 < this.#maxGamepads)
        this.#add(e.gamepad.index);
    });

    instance = this;
  }

  /**
   * @brief Update every gamepad
   */
  update() {
    if (this.#gamepads.length === 0) return;

    const gps = navigator.getGamepads();

    this.#gamepads.forEach(g => g.update(gps[g.index]));
  }

  /**
   * @brief Add a new gamepad
   *
   * @param {Number} index - Index to assign the gamepad
   */
  #add(index) {
    this.#gamepads.push(new PadController(index));
  }

  /**
   * @brief Get a specific gamepad
   *
   * @param {Number} index - Index of gamepad to get
   *
   * @returns Gamepad assigned to the given index
   */
  getGamepad(index) {
    return this.#gamepads[index];
  }

  // Accessors
  get length() { return this.#gamepads.length; }
};

const GamepadHandler = new _GamepadHandler;
export default GamepadHandler;