let instance = null;

class _PickupHandler {
  #pickups;

  constructor() {
    if (instance) throw new Error("PickupHandler singleton reconstructed");

    this.#pickups = [];

    instance = this;
  }

  add(pickup=null) {
    pickup.init();
    this.#pickups.push(pickup);
  }

  update(dt) {
    for (let i = 0; i < this.#pickups.length; ++i) {
      this.#pickups[i].update(dt);

      if (this.#pickups[i].isDead) this.#pickups.splice(i, 1);
    }
  }

  draw() {
    this.#pickups.forEach(p => p.draw());
  }

  // Accessors
  get pickups() { return this.#pickups; }
};

const PickupHandler = new _PickupHandler;
export default PickupHandler;