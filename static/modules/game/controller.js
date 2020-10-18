class GameController {
  constructor() {
    this.gameTime = 0;
    this.gameSpeeds = [
      { name: "Normal", mult: 1 },
      { name: "Slow", mult: 0.3 },
      { name: "Fast", mult: 3 },
      { name: "Paused", mult: 0 },
    ];
    this.currentSpeed = 0;
    this.currentSecond = 0;
    this.frameCount = 0;
    this.framesLastSecond = 0;
    this.lastFrameTime = 0;
    this.currentFrameTime = null;
  }

  getGameSpeed() {
    return this.gameSpeeds[this.currentSpeed].name;
  }
  getGameFPS() {
    return this.framesLastSecond;
  }

  setTime() {
    this.currentFrameTime = Date.now();
    var timeElapsed = this.currentFrameTime - this.lastFrameTime;
    this.gameTime += Math.floor(
      timeElapsed * this.gameSpeeds[this.currentSpeed].mult
    );
  }
  setLastFrameTime() {
    this.lastFrameTime = this.currentFrameTime;
  }
  countFrame() {
    var sec = Math.floor(Date.now() / 1000);
    if (sec !== this.currentSecond) {
      this.currentSecond = sec;
      this.framesLastSecond = this.frameCount;
      this.frameCount = 1;
    } else {
      this.frameCount++;
    }
  }
  isPaused() {
    return this.gameSpeeds[this.currentSpeed].mult === 0;
  }
  switchGameSpeed() {
    this.currentSpeed =
      this.currentSpeed >= this.gameSpeeds.length - 1
        ? 0
        : this.currentSpeed + 1;
  }
}

export default new GameController();
