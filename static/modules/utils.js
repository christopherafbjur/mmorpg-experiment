import settings from "./settings";
class Utils {
  toIndex(x, y) {
    const { dimensions } = settings.map;
    const mapW = dimensions.horizontalTilesAmount;
    return y * mapW + x;
  }
}

export default new Utils();
