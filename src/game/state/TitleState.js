import Renderer             from "../../gfx/Renderer";
import AudioHandler         from "../../audio/AudioHandler";
import GamepadHandler       from "../../input/gamepad/GamepadHandler";
import KeyHandler           from "../../input/KeyHandler";
import State                from "./State";
import StateHandler         from "./StateHandler";
import CharacterSelectState from "./CharacterSelectState";

export default class TitleState extends State {
  constructor() { super(); }

  onEnter() { this.init(); }
  onExit()  {
    AudioHandler.stop("startscreen");
  }

  init() {
    AudioHandler.setPlaybackRate("startscreen", 0.7);
    AudioHandler.setVolume("startscreen", 0.8);
    AudioHandler.playMusic("startscreen");
  }

  update(dt) {
    if (KeyHandler.isDown(81) || GamepadHandler.getGamepad(0)?.start) {
      StateHandler.pop();
      StateHandler.push(new CharacterSelectState);
    }
  }

  render() {
    Renderer.drawText("marnis Legend", 76, 52);

    // GitHub logo
    Renderer.image(
      "spritesheet",
      0, 232, 8, 8,
      96,
      132,
      8,
      8
    );

    // Painting
    Renderer.image(
      "spritesheet",
      144, 96, 112, 48,
      72, 72, 112, 48
    );

    // Japanese text
    Renderer.image(
      "spritesheet",
      128, 96, 8, 32,
      60, 72, 8, 32
    );
    Renderer.image(
      "spritesheet",
      136, 96, 8, 16,
      60, 104, 8, 16
    );

    Renderer.image(
      "spritesheet",
      128, 96, 8, 32,
      188, 72, 8, 32
    );
    Renderer.image(
      "spritesheet",
      136, 96, 8, 16,
      188, 104, 8, 16
    );

    Renderer.drawText("happ-2h", 104, 132);
    Renderer.drawText("press start", 84, 164);
  }
};