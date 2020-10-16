class Tile {
  constructor(tx, ty, tt) {
    this.x = tx;
    this.y = ty;
    this.type = tt;
    this.roof = null;
    this.roofType = 0;
    this.eventEnter = null;
    this.object = null;
  }
}

export default Tile;
