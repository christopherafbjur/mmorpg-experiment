import utils from "../utils";

//Singleton
import tilemap from "../tiles/tilemap";

class MapObject {
  constructor(type) {
    this.x = 0;
    this.y = 0;
    this.type = type;
  }

  placeAt(nx, ny) {
    if (tilemap.map[utils.toIndex(this.x, this.y)].object == this) {
      tilemap.map[utils.toIndex(this.x, this.y)].object = null;
    }
    this.x = nx;
    this.y = ny;

    tilemap.map[utils.toIndex(nx, ny)].object = this;
  }
}

export default MapObject;
