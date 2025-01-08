import AudioHandler from "../../../../audio/AudioHandler";
import { randInt, TAU } from "../../../../math/utils";
import Bullet_Basic from "../../bullet/Bullet_Basic";
import Enemy from "../Enemy";
import Renderer from "../../../../gfx/Renderer";
import { SCREEN_WIDTH } from "../../../../game/constants";
import ParticleHandler from "../../../particle/ParticleHandler";
import Explosion from "../../../particle/Explosion";
import Player from "../../player/Player";

export default class Boss_Drummer extends Enemy {
  #action; // What the boss is doing

  /*
    Drum being hit

    0 = None
    1 = Left
    2 = Right
    3 = Both
   */
  #drum;
  #drumTimer;
  #drumDelay; // Speed to hit next drum
  #drumSeq;   // Sequence for phase 3
  #drumSeqi;  // Drum sequence index

  #bullets;

  #playedCry; // Ensure the cry only plays once

  constructor(x=0, y=0, map=null) {
    super(x, y, null, map);

    this.src.x = 0;
    this.src.y = 176;
    this.src.w = 48;
    this.src.h = 32;
    this.dst.w = 48;
    this.dst.h = 32;

    this.hp = 32;
    this.maxHp = this.hp;

    this.hitbox.pos.set(14, 13);
    this.hitbox.dim.set(20, 20);

    this.#action = 4; // Start cry
    this.#drum = 0;
    this.#drumTimer = 0;
    this.#drumDelay = 0.4;

    this.#drumSeq = [
      0,1,0,2,0,3,
      0,1,0,2,0,3,
      0,1,0,1,0,2,0,2,
      0,3,0,3,0,3,0,3
    ];
    this.#drumSeqi = 0;

    this.#bullets = [];

    this.#playedCry = false;

    AudioHandler.setVolume("drumhit", 0);
    AudioHandler.play("drumhit");
    AudioHandler.stop("drumhit");
    AudioHandler.setVolume("drumhit", 0.6);
  }

  update(gos, dt) {
    if (this.#action === 4) {
      AudioHandler.stop("stage02");

      if (!this.#playedCry) {
        this.#playedCry = true;
        AudioHandler.setVolume("cryDrummer", 1.2);
        AudioHandler.play("cryDrummer");
        AudioHandler.setOnended("cryDrummer", () => this.#action = 0);
      }
    }
    else if (this.#action !== 5) {
      this.#drumTimer += dt;

      if (this.#drumTimer >= this.#drumDelay) {
        this.#drumTimer = 0;

        // Simple left-right drumming
        if (this.#action === 0) {
          this.#drum = this.#drum === 1 ? 2 : 1;

          if (this.#drum === 1) {
            this.#bullets.push(new Bullet_Basic(
              this.dst.pos.x + 12,
              this.dst.pos.y + 24,
              0, 1,
              100, 100,
              this.map
            ));
          }
          else {
            this.#bullets.push(new Bullet_Basic(
              this.dst.pos.x + 27,
              this.dst.pos.y + 24,
              0, 1,
              100, 100,
              this.map
            ));
          }
        }
        else if (this.#action === 1) {
          this.#drum = this.#drum === 0 ? 3 : 0;

          if (this.#drum === 3) {
            // Left
            this.#bullets.push(new Bullet_Basic(
              this.dst.pos.x + 12,
              this.dst.pos.y + 24,
              0, 1,
              130, 130,
              this.map
            ));
            this.#bullets.push(new Bullet_Basic(
              this.dst.pos.x + 12,
              this.dst.pos.y + 24,
              -0.5,
              0.8660254,
              110, 110,
              this.map
            ));
            this.#bullets.push(new Bullet_Basic(
              this.dst.pos.x + 12,
              this.dst.pos.y + 24,
              -0.7071067,
              0.7071067,
              100, 100,
              this.map
            ));

            // Right
            this.#bullets.push(new Bullet_Basic(
              this.dst.pos.x + 27,
              this.dst.pos.y + 24,
              0, 1,
              130, 130,
              this.map
            ));
            this.#bullets.push(new Bullet_Basic(
              this.dst.pos.x + 27,
              this.dst.pos.y + 24,
              0.5,
              0.8660254,
              110, 110,
              this.map
            ));
            this.#bullets.push(new Bullet_Basic(
              this.dst.pos.x + 27,
              this.dst.pos.y + 24,
              0.7071067,
              0.7071067,
              100, 100,
              this.map
            ));
          }
        }
        else if (this.#action === 2)  {
          this.#drum = this.#drumSeq[this.#drumSeqi++%this.#drumSeq.length];

          if (this.#drum === 1) {
            this.#bullets.push(new Bullet_Basic(
              this.dst.pos.x + 12,
              this.dst.pos.y + 24,
              0, 1,
              130, 130,
              this.map
            ));
            this.#bullets.push(new Bullet_Basic(
              this.dst.pos.x + 12,
              this.dst.pos.y + 24,
              -0.5,
              0.8660254,
              110, 110,
              this.map
            ));
            this.#bullets.push(new Bullet_Basic(
              this.dst.pos.x + 12,
              this.dst.pos.y + 24,
              -0.7071067,
              0.7071067,
              100, 100,
              this.map
            ));
          }
          else if (this.#drum === 2) {
            this.#bullets.push(new Bullet_Basic(
              this.dst.pos.x + 27,
              this.dst.pos.y + 24,
              0, 1,
              130, 130,
              this.map
            ));
            this.#bullets.push(new Bullet_Basic(
              this.dst.pos.x + 27,
              this.dst.pos.y + 24,
              0.5,
              0.8660254,
              110, 110,
              this.map
            ));
            this.#bullets.push(new Bullet_Basic(
              this.dst.pos.x + 27,
              this.dst.pos.y + 24,
              0.7071067,
              0.7071067,
              100, 100,
              this.map
            ));
          }
          else if (this.#drum === 3) {
            const nBullets = randInt(4, 10);

            for (let i = 0; i < nBullets; ++i) {
              const t = (i / nBullets) * TAU;

              this.#bullets.push(new Bullet_Basic(
                this.dst.x + 21,
                this.dst.y + 25,
                Math.cos(t),
                Math.sin(t),
                randInt(130, 170),
                randInt(130, 170),
                this.map
              ));
            }
          }
        }

        // Play drum sound
        if (this.#drum === 1) {
          AudioHandler.play("drumhit");
          AudioHandler.pan("drumhit", -0.7);
        }
        else if (this.#drum === 2) {
          AudioHandler.play("drumhit");
          AudioHandler.pan("drumhit", 0.7);
        }
        else if (this.#drum === 3) {
          AudioHandler.play("drumhit");
          AudioHandler.pan("drumhit", 0);
        }
      }
    }
    else if (this.#action === 5) {
      this.dst.x = (6*16 + 8) + 2 * Math.cos((++this.#drumTimer));

      if (this.#drumTimer%5 === 0)
        ParticleHandler.add(new Explosion(
          randInt(this.dst.x - 16, this.dst.x + this.dst.w),
          randInt(this.dst.y, this.dst.y + this.dst.h - 16),
          7,
          this.map
        ));

      // Kill after 3 seconds
      if ((this.#drumDelay += dt) >= 3) this.kill();
    }

    // Check for player collision
    gos.forEach(go => {
      if (go instanceof Player && this.hitboxAdj().intersects(go.hitboxAdj())) {
        go.hurt(this.maxHp<<1);
      }
    });

    for (let i = 0; i < this.#bullets.length; ++i) {
      this.#bullets[i].update(gos, dt);

      if (this.#bullets[i].isDead) {
        this.#bullets.splice(i, 1);
      }
    }
  }

  drawHpBar() {
    if (this.#action === 4) return;

    Renderer.rect( 6, 6, SCREEN_WIDTH - 12, 12, "#612721", true);
    Renderer.rect( 8, 8, (SCREEN_WIDTH - 16) * (this.hp / this.maxHp), 8, "#8FD032", true);
  }

  hurt(dmg=1) {
    if (this.#action === 4) return;

    this.hp -= dmg;

    // Change action based on HP
    if (this.hpPercent() > 0.75) {
      this.#action = 0;
    }
    else if (this.hpPercent() > 0.50) {
      this.#action = 1;
      this.#drumDelay = 0.15;
    }
    else if (this.hpPercent() > 0.25) {
      this.#action = 2;
      this.#drumDelay = 0.1;
    }

    if (this.hp <= 0) {
      this.hp = 0;
      this.#action = 5;    // Death animation
      this.#drum = 0;      // Raise both hands
      this.#drumTimer = 0; // Recycle for animation
      this.#drumDelay = 0; // Recycle for timing
    }
  }

  draw() {
    this.src.x = 16 * 3 * this.#drum;
    super.draw();

    this.#bullets.forEach(b => b.draw());
  }
};