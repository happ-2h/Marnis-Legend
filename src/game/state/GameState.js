import Stage from "./stage/Stage";
import State from "./State";

export default class GameState extends State {
  #selectedChar; // From character select screen
  #currStage;    // Current stage class reference

  constructor(selectedChar=0) {
    super();

    this.#selectedChar = selectedChar;

    this.#currStage = new Stage([this.#selectedChar], "stage02");
  }

  onEnter() { this.init(); }
  onExit()  {}

  init() {}

  update(dt) {
   this.#currStage.update(dt);

    if (this.#currStage.status === "complete") {
      // Increment stage
      switch(Stage.stageNumber) {
        case 1:
          this.#currStage.onExit();
          this.#currStage = null;
          this.#currStage = new Stage([this.#selectedChar], "stage02");
          break;
        default:
          // TODO game win state
          break;
      }
    }
  }

  render() { this.#currStage.render(); }
};