import SETTINGS from "./mapSettings";
class Utils {
  toIndex(x, y) {
    return y * SETTINGS.tiles.horizontalCount + x;
  }
}

export default new Utils();
