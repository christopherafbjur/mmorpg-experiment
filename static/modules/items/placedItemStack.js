import utils from "../utils";

class placedItemStack {
  constructor(params) {
    this.type = params.id;
    this.qty = params.quantity;
    this.x = 0;
    this.y = 0;

    this.mapTileData = params.mapTileData;
  }

  placeAt(nx, ny) {
    if (this.mapTileData.map[utils.toIndex(this.x, this.y)].itemStack == this) {
      this.mapTileData.map[utils.toIndex(this.x, this.y)].itemStack = null;
    }

    this.x = nx;
    this.y = ny;

    this.mapTileData.map[utils.toIndex(nx, ny)].itemStack = this;
  }
}

export default placedItemStack;
