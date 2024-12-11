export default class Game {
  #last; // Previous RAF timestamp

  constructor() {
    this.#last = 0;

    this.init();
  }

  init() {
    this.#last = performance.now();
    this.update(this.#last);
  }

  update(ts) {
    const dt = (ts - this.#last) / 1000;
    this.#last = ts;

    requestAnimationFrame(this.update.bind(this));

    this.render();
  }

  render() {}
};