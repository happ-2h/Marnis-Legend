import Enemy from "../Enemy";

export default class Enemy_Mage extends Enemy {
  constructor(x=0, y=0) {
    super(x, y, null);

    this.src.y = 32;
  }
};