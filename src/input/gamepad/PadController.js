import Vec2D from "../../math/Vec2D";

export default class PadController {
  #index;   // Given unique index

  #axes;    // Analog stick values
  #buttons; // Button press values

  #deadzone;

  constructor(index) {
    this.#index = index;

    this.#axes    = [];
    this.#buttons = [];

    this.#deadzone = 0.5;
  }

  update({ axes, buttons, connected }) {
    if (!connected) return;

    this.#axes = [ ...axes ];
    this.#buttons = [ ...buttons ];
  }

  axes(index) {
    return this.#axes[index];
  }

  isDown(buttonID) {
    return this.#buttons[buttonID].pressed || this.#buttons[buttonID].value > 0;
  }

  // Accessors
  get index() { return this.#index; }

  get deadzone() { return this.#deadzone; }

  // D-Pad
  get isDpad_Up()    { return this.isDown(12); }
  get isDpad_Down()  { return this.isDown(13); }
  get isDpad_Left()  { return this.isDown(14); }
  get isDpad_Right() { return this.isDown(15); }

  // Buttons
  // - Action buttons (e.g. ABXY)
  get actionSouth() { return this.isDown(0); }
  get actionEast()  { return this.isDown(1); }
  get actionWest()  { return this.isDown(2); }
  get actionNorth() { return this.isDown(3); }

  // - Middle buttons
  get select() { return this.isDown(8); }
  get start()  { return this.isDown(9); }


  // Analog sticks
  get lstick() { return new Vec2D(this.#axes[0], this.#axes[1]); }
  get rstick() { return new Vec2D(this.#axes[2], this.#axes[3]); }

  get lstick_Up()    { return this.lstick.y < -this.#deadzone; }
  get lstick_Down()  { return this.lstick.y > this.#deadzone;  }
  get lstick_Left()  { return this.lstick.x < -this.#deadzone; }
  get lstick_Right() { return this.lstick.x > this.#deadzone;  }

  // Mutators
  set deadzone(dz) { this.#deadzone = dz; }
};