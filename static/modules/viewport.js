import SETTINGS from "./mapSettings.json";
class Viewport {
  constructor(params) {
    this.screen = [params.canvasW, params.canvasH];
    this.startTile = [0, 0];
    this.endTile = [0, 0];
    this.offset = [0, 0];
  }

  update(px, py) {
    this.offset[0] = Math.floor(this.screen[0] / 2 - px);
    this.offset[1] = Math.floor(this.screen[1] / 2 - py);

    var tile = [
      Math.floor(px / SETTINGS.tiles.width),
      Math.floor(py / SETTINGS.tiles.height),
    ];

    this.startTile[0] =
      tile[0] - 1 - Math.ceil(this.screen[0] / 2 / SETTINGS.tiles.width);
    this.startTile[1] =
      tile[1] - 1 - Math.ceil(this.screen[1] / 2 / SETTINGS.tiles.height);

    if (this.startTile[0] < 0) {
      this.startTile[0] = 0;
    }
    if (this.startTile[1] < 0) {
      this.startTile[1] = 0;
    }

    this.endTile[0] =
      tile[0] + 1 + Math.ceil(this.screen[0] / 2 / SETTINGS.tiles.width);
    this.endTile[1] =
      tile[1] + 1 + Math.ceil(this.screen[1] / 2 / SETTINGS.tiles.height);

    if (this.endTile[0] >= SETTINGS.tiles.horizontalCount) {
      this.endTile[0] = SETTINGS.tiles.horizontalCount - 1;
    }
    if (this.endTile[1] >= SETTINGS.tiles.verticalCount) {
      this.endTile[1] = SETTINGS.tiles.verticalCount - 1;
    }
  }
}

export default Viewport;
