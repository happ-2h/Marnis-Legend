import AudioHandler from "../../audio/AudioHandler";
import ParticleHandler from "../../entity/particle/ParticleHandler";
import PickupHandler from "../../entity/pickup/PickupHandler";
import EndState from "./EndState";
import Stage from "./stage/Stage";
import State from "./State";
import StateHandler from "./StateHandler";

export default class GameState extends State {
  #selectedChar; // From character select screen
  #currStage;    // Current stage class reference

  constructor(selectedChar=0) {
    super();

    this.#selectedChar = selectedChar;

    this.#currStage = new Stage([this.#selectedChar], "stage01");
  }

  onEnter() { this.init(); }
  onExit()  {
    PickupHandler.clear();
    ParticleHandler.clear();
    AudioHandler.stopAll();
  }

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
          this.#currStage?.onExit();
          this.#currStage = null;
          StateHandler.pop();
          StateHandler.push(new EndState);
          break;
      }
    }
  }

  render() { this.#currStage.render(); }
};