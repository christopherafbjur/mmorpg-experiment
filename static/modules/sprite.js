//Singleton
import canvas from "./canvas";
import tileset from "./tiles/tileset";

export default class Sprite {
  constructor(data, sheet) {
    this.data = data;
    this.animated = data.length > 1;
    this.frameCount = data.length;
    this.duration = 0;
    this.loop = true;
    this.sheet = sheet;
    this.initialize();
  }

  initialize() {
    if (this.data.length > 1) {
      for (var i in this.data) {
        if (typeof this.data[i].d == "undefined") {
          this.data[i].d = 100;
        }
        this.duration += this.data[i].d;
        if (typeof this.data[i].loop != "undefined") {
          this.loop = this.data[i].loop ? true : false;
        }
      }
    }
    this.frames = this.data;
  }

  draw(t, x, y, skipAnimation) {
    var frameIdx = 0;

    if (!this.loop && this.animated && t >= this.duration) {
      frameIdx = this.frames.length - 1;
    } else if (this.animated) {
      t = t % this.duration;
      var totalD = 0;

      for (var i in this.frames) {
        totalD += this.frames[i].d;
        frameIdx = i;

        if (t <= totalD) {
          break;
        }
      }
    }
    if (skipAnimation) {
      frameIdx = 0;
    }

    var offset =
      typeof this.frames[frameIdx].offset == "undefined"
        ? [0, 0]
        : this.frames[frameIdx].offset;

    canvas.ctx.drawImage(
      tileset.sheets[this.sheet].image,
      this.frames[frameIdx].x,
      this.frames[frameIdx].y,
      this.frames[frameIdx].w,
      this.frames[frameIdx].h,
      x + offset[0],
      y + offset[1],
      this.frames[frameIdx].w,
      this.frames[frameIdx].h
    );
  }
}
