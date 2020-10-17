import SETTINGS from "../mapSettings.json";
import gameMap from "../map/data/map";
import Tile from "./tile";
import rooflist from "./data/roofList";

class TileMap {
  constructor() {
    this.map = [];
    this.w = 0;
    this.h = 0;
    this.levels = 4; //Hardcoded. In a proper map engine we may wish to calculate this dynamically when loading in our list of object types we'll be using on our map.

    this.buildMapFromData();
    this.addRoofs();
    this.addTestTileWithEvent();
  }

  buildMapFromData() {
    const map = gameMap;
    const w = SETTINGS.tiles.horizontalCount;
    const h = SETTINGS.tiles.verticalCount;

    this.w = w;
    this.h = h;

    if (map.length != w * h) {
      return false;
    }

    this.map.length = 0;

    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        this.map.push(new Tile(x, y, map[y * w + x]));
      }
    }
    return true;
  }

  addRoofs() {
    for (var i in rooflist) {
      var r = rooflist[i];
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

  addTestTileWithEvent() {
    ///Used for adding an event tile for a specific tile, in this case tilemap with index 42
    this.map[2 * SETTINGS.tiles.horizontalCount + 2].eventEnter = function () {
      console.log("EVENT TILE: Entered tile 2,2");
    };
  }
}

export default new TileMap();
