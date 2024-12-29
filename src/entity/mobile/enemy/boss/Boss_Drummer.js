import AudioHandler from "../../../../audio/AudioHandler";
import { randInt, TAU } from "../../../../math/utils";
import Bullet_Basic from "../../bullet/Bullet_Basic";
import Enemy from "../Enemy";

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

  constructor(x=0, y=0, map=null) {
    super(x, y, null, map);

    this.src.x = 0;
    this.src.y = 176;
    this.src.w = 48;
    this.src.h = 32;
    this.dst.w = 48;
    this.dst.h = 32;


    this.hitbox.pos.set(14, 13);
    this.hitbox.dim.set(20, 20);

    this.#action = 2;
    this.#drum = 0;
    this.#drumTimer = 0;
    this.#drumDelay = 0.1;

    this.#drumSeq = [
      0,1,0,2,0,3,
      0,1,0,2,0,3,
      0,1,0,1,0,2,0,2,
      0,3,0,3,0,3,0,3
    ];
    this.#drumSeqi = 0;

    this.#bullets = [];

    AudioHandler.setVolume("drumhit", 0);
    AudioHandler.play("drumhit");
    AudioHandler.stop("drumhit");
    AudioHandler.setVolume("drumhit", 0.8);
  }

  update(gos, dt) {
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

    for (let i = 0; i < this.#bullets.length; ++i) {
      this.#bullets[i].update(gos, dt);

      if (this.#bullets[i].isDead) {
        this.#bullets.splice(i, 1);
      }
    }
  }

  draw() {
    this.src.x = 16 * 3 * this.#drum;
    super.draw();

    this.#bullets.forEach(b => b.draw());
  }
};