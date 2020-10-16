import utils from "./utils";
class MapObject {
  constructor(params) {
    this.x = 0;
    this.y = 0;
    this.type = params.type;
    this.mapTileData = params.mapTileData;
  }

  placeAt(nx, ny) {
    if (this.mapTileData.map[utils.toIndex(this.x, this.y)].object == this) {
      this.mapTileData.map[utils.toIndex(this.x, this.y)].object = null;
    }
    this.x = nx;
    this.y = ny;

    this.mapTileData.map[utils.toIndex(nx, ny)].object = this;
  }
}

export default MapObject;
