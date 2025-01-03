let instance = null;

class _ParticleHandler {
  #particles;

  constructor() {
    if (instance) throw new Error("ParticleHandler singleton reconstructed");

    this.#particles = [];

    instance = this;
  }

  add(particle=null) {
    particle.init();
    this.#particles.push(particle);
  }

  update(dt) {
    for (let i = 0; i < this.#particles.length; ++i) {
      this.#particles[i].update(dt);

      if (this.#particles[i].isDead) this.#particles.splice(i, 1);
    }
  }

  draw() {
    this.#particles.forEach(p => p.draw());
  }

  clear() {
    this.#particles.splice(0, this.#particles.length);
  }
};

const ParticleHandler = new _ParticleHandler;
export default ParticleHandler;