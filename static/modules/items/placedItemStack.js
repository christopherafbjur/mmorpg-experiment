import utils from "../utils";

//Singleton
import tilemap from "../tiles/tilemap";

class placedItemStack {
  constructor(type, quantity) {
    this.type = type;
    this.qty = quantity;
    this.x = 0;
    this.y = 0;
  }

  placeAt(nx, ny) {
    if (tilemap.map[utils.toIndex(this.x, this.y)].itemStack == this) {
      tilemap.map[utils.toIndex(this.x, this.y)].itemStack = null;
    }

    this.x = nx;
    this.y = ny;

    tilemap.map[utils.toIndex(nx, ny)].itemStack = this;
  }
}

export default placedItemStack;
