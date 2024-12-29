import { lerp, randInt } from "../../../../math/utils";
import Vec2D from "../../../../math/Vec2D";
import Enemy from "../Enemy";
import Player from "../../player/Player";
import Bullet_BossEyeBasic from "../../bullet/Bullet_BossEyeBasic";
import Bullet_BossEyeLaser from "../../bullet/Bullet_BossEyeLaser";
import Renderer from "../../../../gfx/Renderer";
import ParticleHandler from "../../../particle/ParticleHandler";
import Explosion from "../../../particle/Explosion";
import { SCREEN_HEIGHT, TILE_SIZE } from "../../../../game/constants";
import AudioHandler from "../../../../audio/AudioHandler";

export default class Boss_Eye extends Enemy {
  #action;     // What the boss is doing

  #timer;      // Action timer
  #timerDelay; // Action timer delay

  #bullets;     // Bullet container
  #bulletTimer; // Timer to shoot bullet
  #bulletDelay; // Delay to shoot bullet
  #shootAng;    // Shoot angle for actions 1 and 2
  #angles;      // Shoot angle lookup table

  #frame;       // Current frame for animation
  #upDn;        // Up or down animation

  #targetPos;   // Move coordinates

  #playedCry;   // Ensure the cry only plays once

  constructor(x=0, y=0, map=null) {
    super(x, y, null, map);

    this.src.x = 0;
    this.src.y = 96;
    this.src.w = 48;
    this.src.h = 48;
    this.dst.w = 48;
    this.dst.h = 48;

    this.hitbox.pos.set(16, 27);
    this.hitbox.dim.set(16, 16);

    this.#action = 4; // Start cry

    this.#timer = 0;
    this.#timerDelay = 0.5;

    this.#bullets = [];
    this.#bulletTimer = 0;
    this.#bulletDelay = 0.2;
    this.#shootAng = 0;
    this.#angles = [
      {x: Math.cos(Math.PI / 3) , y: Math.sin(Math.PI / 3) },
      {x: 0.25 , y: 0.93301270189 },
      {x: 0 , y: 1 },
      {x: -0.25 , y: 0.93301270189 },
      {x: -Math.cos(Math.PI / 3) , y: Math.sin(Math.PI / 3) },
      {x: -0.25 , y: 0.93301270189 },
      {x: 0 , y: 1 },
      {x: 0.25 , y: 0.93301270189 }
    ];

    this.#frame = 0;
    this.#upDn = false;

    this.#targetPos = new Vec2D(x, y);

    this.#playedCry = false;
  }

  update(gos, dt) {
    if (this.#action === 4) {
      if (!this.#playedCry) {
        this.#playedCry = true;
        AudioHandler.setVolume("cryEye", 0.7);
        AudioHandler.play("cryEye");
        AudioHandler.setOnended("cryEye", () => this.#action = 0);
      }
    }
    else {
      this.#timer += dt;
      this.#bulletTimer += dt;
    }

    ++this.#frame;

    if (this.#timer >= this.#timerDelay) {
      this.#timer = 0;

      // Follow player 1
      if (this.#action === 0 || this.#action === 1) {
        gos.forEach(go => {
          if (go instanceof Player && go.playerNum === 1) {
            this.#targetPos.copy(go.dst.pos);
          }
        });
      }
      // Follow both
      else if (this.#action === 2) {
        gos.forEach(go => {
          if (go instanceof Player) {
            this.#targetPos.copy(go.dst.pos);
          }
        });
      }
      // Death animation
      else if (this.#action === 3) {
        ParticleHandler.add(new Explosion(
          randInt(this.dst.x, this.dst.x + this.dst.w - 16),
          randInt(this.dst.y + 16, this.dst.y + 32),
          5,
          this.map
        ));
      }
    }

    this.dst.x = lerp(
      this.dst.x,
      this.#targetPos.x - 16,
      0.1
    );

    // Floating animation
    if (this.#action !== 3) {
      this.#upDn = !(this.#frame%30) ? !this.#upDn : this.#upDn;
      this.dst.y = lerp(
        this.dst.y,
        this.dst. y + (this.#upDn ? 4 : -4),
        0.1
      );
    }
    else {
      this.dst.y = lerp(
        this.dst.y,
        this.dst.y + 48,
        0.03
      );

      if (this.dst.y >= SCREEN_HEIGHT + TILE_SIZE) {
        this.isDead = true;
      }
    }

    if (this.#bulletTimer >= this.#bulletDelay) {
      this.#bulletTimer = 0;

      if (this.#action === 0) {
        this.#bullets.push(new Bullet_BossEyeBasic(
          this.dst.x + 19,
          this.dst.y + 38,
          0, 1, this.map
        ));
      }
      else if (this.#action === 1) {
        this.#bullets.push(new Bullet_BossEyeBasic(
          this.dst.x + 20,
          this.dst.y + 38,
          this.#angles[this.#shootAng].x,
          this.#angles[this.#shootAng].y,
          this.map
        ));
      }
      else if (this.#action === 2) {
        this.#bullets.push(new Bullet_BossEyeBasic(
          this.dst.x + 20,
          this.dst.y + 38,
          this.#angles[this.#shootAng].x,
          this.#angles[this.#shootAng].y,
          this.map
        ));

        this.#bullets.push(new Bullet_BossEyeLaser(
          this.dst.pos.x + (this.#shootAng&1 ? 8 : 39),
          this.dst.pos.y + 39,
          this.map
        ));
      }

      this.#shootAng = this.#shootAng + 1 >= this.#angles.length ? 0 : this.#shootAng + 1;
    }

    for (let i = 0; i < this.#bullets.length; ++i) {
      this.#bullets[i].update(gos, dt);

      if (this.#bullets[i].isDead) {
        this.#bullets.splice(i, 1);
      }
    }
  }

  hurt(dmg=1) {
    if (this.#action === 4) return;

    this.hp -= dmg;

    if (this.hp <= 0) {
      this.hp = 0;
      this.kill();
    }
  }

  kill() {
    this.#action = 3;
    this.#timerDelay = 0.1;
  }

  draw() {
    super.draw();

    // Wing shooting notifiers
    if (this.#action === 2) {
      Renderer.image(
        "spritesheet",
        16 + (!(this.#shootAng&1)<<4), 144, 16, 16,
        this.dst.pos.x,
        this.dst.pos.y + 32,
        16, 16
      );
      Renderer.image(
        "spritesheet",
        16 + ((this.#shootAng&1)<<4), 160, 16, 16,
        this.dst.pos.x + 32,
        this.dst.pos.y + 32,
        16, 16
      );
    }
    else {
      Renderer.image(
        "spritesheet",
        16, 144, 16, 16,
        this.dst.pos.x,
        this.dst.pos.y + 32,
        16, 16
      );
      Renderer.image(
        "spritesheet",
        16, 160, 16, 16,
        this.dst.pos.x + 32,
        this.dst.pos.y + 32,
        16, 16
      );
    }

    // Shadow
    Renderer.image(
      "spritesheet",
      48, 144, 16, 16,
      this.dst.x + 16,
      this.dst.y + 42,
      16, 16
    );

    this.#bullets.forEach(b => b.draw());
  }
};