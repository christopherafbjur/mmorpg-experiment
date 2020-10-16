import Tile from "./tile";

class TileMap {
  constructor() {
    this.map = [];
    this.w = 0;
    this.h = 0;
    this.levels = 4; //Hardcoded. In a proper map engine we may wish to calculate this dynamically when loading in our list of object types we'll be using on our map.
  }

  buildMapFromData(d, w, h) {
    this.w = w;
    this.h = h;

    if (d.length != w * h) {
      return false;
    }

    this.map.length = 0;

    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        this.map.push(new Tile(x, y, d[y * w + x]));
      }
    }
    return true;
  }

  addRoofs(roofs) {
    for (var i in roofs) {
      var r = roofs[i];
      if (
        r.x < 0 ||
        r.y < 0 ||
        r.x >= this.w ||
        r.y >= this.h ||
        r.x + r.w > this.w ||
        r.y + r.h > this.h ||
        r.data.length != r.w * r.h
      ) {
        continue;
      }
      for (var y = 0; y < r.h; y++) {
        for (var x = 0; x < r.w; x++) {
          var tileIdx = (r.y + y) * this.w + r.x + x;
          this.map[tileIdx].roof = r;
          this.map[tileIdx].roofType = r.data[y * r.w + x];
        }
      }
    }
  }
}

export default TileMap;
