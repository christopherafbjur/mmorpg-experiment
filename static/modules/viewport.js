class Viewport {
  constructor(params) {
    this.screen = [params.canvasW, params.canvasH];
    this.startTile = [0, 0];
    this.endTile = [0, 0];
    this.offset = [0, 0];

    this.tileW = params.tileW;
    this.tileH = params.tileH;
    this.mapW = params.mapW;
    this.mapH = params.mapH;
  }

  update(px, py) {
    this.offset[0] = Math.floor(this.screen[0] / 2 - px);
    this.offset[1] = Math.floor(this.screen[1] / 2 - py);

    var tile = [
      Math.floor(px / this.tileW), //!import tileW
      Math.floor(py / this.tileH), //!import tileH
    ];

    this.startTile[0] =
      tile[0] - 1 - Math.ceil(this.screen[0] / 2 / this.tileW);
    this.startTile[1] =
      tile[1] - 1 - Math.ceil(this.screen[1] / 2 / this.tileH);

    if (this.startTile[0] < 0) {
      this.startTile[0] = 0;
    }
    if (this.startTile[1] < 0) {
      this.startTile[1] = 0;
    }

    this.endTile[0] = tile[0] + 1 + Math.ceil(this.screen[0] / 2 / this.tileW);
    this.endTile[1] = tile[1] + 1 + Math.ceil(this.screen[1] / 2 / this.tileH);

    if (this.endTile[0] >= this.mapW) {
      this.endTile[0] = this.mapW - 1;
    }
    if (this.endTile[1] >= this.mapH) {
      this.endTile[1] = this.mapH - 1;
    }
  }
}

export default Viewport;
