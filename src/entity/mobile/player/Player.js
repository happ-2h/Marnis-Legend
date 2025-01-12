import Entity_Mob       from "../Entity_Mob";
import PlayerController from "../../../controller/PlayerController";
import CollisionChecker from "../../../math/CollisionChecker";
import MapHandler       from "../../../map/MapHandler";
import ParticleHandler  from "../../particle/ParticleHandler";
import StateHandler     from "../../../game/state/StateHandler";
import GameOverState    from "../../../game/state/GameOverState";
import Star             from "../../particle/Star";

import { rand }         from "../../../math/utils";
import { SCREEN_WIDTH } from "../../../game/constants";

export default class Player extends Entity_Mob {
  // Firing rates and timers
  #primaryRate;
  #primaryRateTimer;
  #secondaryRate;
  #secondaryRateTimer;

  #status;       // Current player status flags

  #gamepadIndex; // Gamepad assigned to this player
  #playerNum;    // Player 1 or 2

  #deathTimer;   // Time taken before showing gameover screen

  // Status flags
  static PRIMARY_FLAG   = 0b001;
  static SECONDARY_FLAG = 0b010;
  static DEAD           = 0b100;

  /**
   * @param {Number} x   - x-position
   * @param {Number} y   - y-position
   * @param {Number} num - Player number (1 or 2)
   * @param {String} map - Map player belongs to
   */
  constructor(x=0, y=0, num=1, map=null) {
    super(x, y, new PlayerController, map);

    this.#gamepadIndex = null;
    this.#playerNum = num;

    this.#primaryRate = 0.3;
    this.#primaryRateTimer = 0;
    this.#secondaryRate = 2;
    this.#secondaryRateTimer = 0;

    this.#deathTimer = 0.5;

    this.#status = 0;

    this.hp = 20;
    this.maxHp = this.hp;

    this.hitbox.pos.set(4, 7);
    this.hitbox.dim.set(8, 8);

    this.vel.set(100, 100);
  }

  update(dt) {
    if (!(this.#status & Player.DEAD)) {
      this.inputMovement();
      this.inputActions(dt);
      this.handleMovement(dt);
    }
    else {
      this.#deathTimer -= dt;

      if (this.#deathTimer <= 0) {
        StateHandler.pop();
        StateHandler.push(new GameOverState);
      }
    }
  }

  draw() {
    if (!(this.#status & Player.DEAD)) {
      super.draw();
      this.drawHpBar();
    }
  }

  inputMovement() {
    this.dir.reset();
    if (this.controller.isRequestingLeft())       this.dir.x = -1;
    else if (this.controller.isRequestingRight()) this.dir.x = 1;
    //else this.dir.x = 0; // Free roam NOTE breaks collision

    else if (this.controller.isRequestingUp())   this.dir.y = -1;
    else if (this.controller.isRequestingDown()) this.dir.y = 1;
    // else this.dir.reset(); // Free roam NOTE breaks collision

    this.dir.normalize();
  }

  handleMovement(dt) {
    let nextx = this.dst.x + this.vel.x * this.dir.x * dt;
    let nexty = this.dst.y + this.vel.y * this.dir.y * dt;

    // Handle collision
    this.block = false;
    CollisionChecker.checkTile(this, dt, this.map);

    // If collision occured
    if (this.block) {
      if (this.dir.y < 0 || this.dir.y > 0)      nexty = this.dst.y;
      else if (this.dir.x < 0 || this.dir.x > 0) nextx = this.dst.x;
    }

    // Keep inside play field
    if (nextx + this.hitbox.x <= 0) nextx = -this.hitbox.x;
    else if (nextx + this.hitbox.x + this.hitbox.w >= SCREEN_WIDTH)
      nextx = SCREEN_WIDTH - this.hitbox.x - this.hitbox.w;

    if (nexty + this.hitbox.y <= 0) nexty = -this.hitbox.y;
    else if (nexty + this.hitbox.y + this.hitbox.h >= (MapHandler.getMap(this.map).height)<<4)
      nexty = ((MapHandler.getMap(this.map).height)<<4) - this.hitbox.y - this.hitbox.h;

    this.dst.x = nextx;
    this.dst.y = nexty;
  }

  inputActions(dt) {
    if (this.controller.isRequestingA()) this.primaryAction(dt);
    if (this.controller.isRequestingB()) this.secondaryAction(dt);
  }

  primaryAction(dt) {
    if (this.primaryRateTimer >= this.primaryRate) {
      this.primaryRateTimer = 0;
      this.status |= Player.PRIMARY_FLAG;
    }
  }

  secondaryAction(dt) {
    if (this.secondaryRateTimer >= this.secondaryRate) {
      this.secondaryRateTimer = 0;
      this.status |= Player.SECONDARY_FLAG;
    }
  }

  kill() {
    if (this.#status & Player.DEAD) return;

    this.#status |= Player.DEAD;

    for (let i = 0; i < 40; ++i) {
      ParticleHandler.add(new Star(
        this.dst.x + (this.dst.w>>1),
        this.dst.y + (this.dst.h>>1),
        Math.cos(rand(0.1, 10)),
        Math.sin(rand(0.1, 10)),
        this.map
      ));
    }
  }

  // Accessors
  get primaryRate()        { return this.#primaryRate; }
  get primaryRateTimer()   { return this.#primaryRateTimer; }
  get secondaryRate()      { return this.#secondaryRate; }
  get secondaryRateTimer() { return this.#secondaryRateTimer; }

  get status()    { return this.#status; }
  get playerNum() { return this.#playerNum; }

  // Mutators
  set primaryRate(pr)        { this.#primaryRate = pr; }
  set primaryRateTimer(pt)   { this.#primaryRateTimer = pt; }
  set secondaryRate(sr)      { this.#secondaryRate = sr; }
  set secondaryRateTimer(st) { this.#secondaryRateTimer = st; }

  set status(status) { this.#status = status; }
};