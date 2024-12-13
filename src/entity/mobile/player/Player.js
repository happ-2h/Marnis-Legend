import PlayerController from "../../../controller/PlayerController";
import Entity_Mob from "../Entity_Mob";

export default class Player extends Entity_Mob {
  // Firing rates and timers
  #primaryRate;
  #primaryRateTimer;
  #secondaryRate;
  #secondaryRateTimer;

  #status; // Current player status flags

  static PRIMARY_FLAG   = 0b01;
  static SECONDARY_FLAG = 0b10;

  constructor(x=0, y=0) {
    super(x, y, new PlayerController);

    this.#primaryRate = 0.3;
    this.#primaryRateTimer = 0;
    this.#secondaryRate = 2;
    this.#secondaryRateTimer = 0;

    this.#status = 0;

    this.vel.set(100, 100);
  }

  update(dt) {
    this.inputMovement();
    this.inputActions(dt);
    this.handleMovement(dt);
  }

  inputMovement() {
    if (this.controller.isRequestingLeft()) this.dir.x = -1;
    else if (this.controller.isRequestingRight()) this.dir.x = 1;
    else this.dir.x = 0;

    if (this.controller.isRequestingUp()) this.dir.y = -1;
    else if (this.controller.isRequestingDown()) this.dir.y = 1;
    else this.dir.y = 0;

    this.dir.normalize();
  }

  handleMovement(dt) {
    let nextx = this.dst.x + this.vel.x * this.dir.x * dt;
    let nexty = this.dst.y + this.vel.y * this.dir.y * dt;

    this.dst.x = nextx;
    this.dst.y = nexty;
  }

  inputActions(dt) {
    if (this.controller.isRequestingA()) this.primaryAction(dt);
    if (this.controller.isRequestingB()) this.secondaryAction(dt);
  }

  primaryAction(dt)   { return null; }
  secondaryAction(dt) { return null; }

  // Accessors
  get primaryRate()        { return this.#primaryRate; }
  get primaryRateTimer()   { return this.#primaryRateTimer; }
  get secondaryRate()      { return this.#secondaryRate; }
  get secondaryRateTimer() { return this.#secondaryRateTimer; }

  get status() { return this.#status; }

  // Mutators
  set primaryRate(pr)        { this.#primaryRate = pr; }
  set primaryRateTimer(pt)   { this.#primaryRateTimer = pt; }
  set secondaryRate(sr)      { this.#secondaryRate = sr; }
  set secondaryRateTimer(st) { this.#secondaryRateTimer = st; }

  set status(status) { this.#status = status; }
};