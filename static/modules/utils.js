import SETTINGS from "./mapSettings";
class Utils {
  toIndex(x, y) {
    return y * SETTINGS.tiles.horizontalCount + x;
  }

  distanceTo(from, to) {
    var a = from[0] - to[0];
    var b = from[1] - to[1];
    var c = Math.sqrt(a * a + b * b);
    return c;
  }
}

export default new Utils();
