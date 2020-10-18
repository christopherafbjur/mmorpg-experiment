import controller from "../game/controller";
class KeyboardController {
  constructor() {
    this.keyDown = {};
    this.initListeners();
  }

  initListeners() {
    //Init event listeners for player movement
    window.addEventListener("keydown", (e) => {
      this.handleMovement(e, true);
      this.handlePickup(e, true);
    });
    window.addEventListener("keyup", (e) => {
      this.handleMovement(e, false);
      this.handleGameSpeed(e);
      this.handlePickup(e, false);
    });
  }

  handleMovement(e, toggle) {
    //Up/Down/Left/Right keys
    if (e.keyCode >= 37 && e.keyCode <= 40) {
      this.keyDown[e.keyCode] = toggle;
    }
  }
  handlePickup(e, toggle) {
    //P key
    if (e.keyCode === 80) {
      this.keyDown[e.keyCode] = toggle;
    }
  }
  handleGameSpeed(e) {
    //S key
    if (e.keyCode === 83) {
      controller.switchGameSpeed();
    }
  }
}

export default KeyboardController;
