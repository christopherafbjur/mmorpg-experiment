import GameMap from "./map";

class Character {
  constructor(params) {
    //Player movement data
    this.tileFrom = [1, 1];
    this.tileTo = [1, 1];
    this.timeMoved = 0;
    this.dimensions = [30, 30];
    this.position = [45, 45];
    this.delayMove = 700;

    //Player direction data
    this.directions = params.directions;

    this.direction = this.directions.up;
    this.sprites = {};
    this.sprites[this.directions.up] = [{ x: 0, y: 120, w: 30, h: 30 }];
    this.sprites[this.directions.right] = [{ x: 0, y: 150, w: 30, h: 30 }];
    this.sprites[this.directions.down] = [{ x: 0, y: 180, w: 30, h: 30 }];
    this.sprites[this.directions.left] = [{ x: 0, y: 210, w: 30, h: 30 }];

    //Map data
    this.tileW = params.map.tiles.width;
    this.tileH = params.map.tiles.height;
    this.mapW = params.map.dimensions.horizontalTilesAmount;
    this.mapH = params.map.dimensions.verticalTilesAmount;

    this.floorTypes = params.floorTypes;
    this.tileTypes = params.tileTypes;
    this.gameMap = GameMap;
  }

  placeAt(x, y) {
    this.tileFrom = [x, y];
    this.tileTo = [x, y];
    this.position = [
      this.tileW * x + (this.tileW - this.dimensions[0]) / 2,
      this.tileH * y + (this.tileH - this.dimensions[1]) / 2,
    ];
  }

  processMovement(t) {
    if (
      this.tileFrom[0] == this.tileTo[0] &&
      this.tileFrom[1] == this.tileTo[1]
    ) {
      return false;
    }

    if (t - this.timeMoved >= this.delayMove) {
      this.placeAt(this.tileTo[0], this.tileTo[1]);

      var tileFloor = this.tileTypes[
        this.gameMap[this.toIndex(this.tileFrom[0], this.tileFrom[1])]
      ].floor;

      if (tileFloor == this.floorTypes.ice) {
        if (this.canMoveDirection(this.direction)) {
          this.moveDirection(this.direction, t);
        }
      } else if (tileFloor == this.floorTypes.conveyorL && this.canMoveLeft()) {
        this.moveLeft(t);
      } else if (
        tileFloor == this.floorTypes.conveyorR &&
        this.canMoveRight()
      ) {
        this.moveRight(t);
      } else if (tileFloor == this.floorTypes.conveyorU && this.canMoveUp()) {
        this.moveUp(t);
      } else if (tileFloor == this.floorTypes.conveyorD && this.canMoveDown()) {
        this.moveDown(t);
      }
    } else {
      this.position[0] =
        this.tileFrom[0] * this.tileW + (this.tileW - this.dimensions[0]) / 2;
      this.position[1] =
        this.tileFrom[1] * this.tileH + (this.tileH - this.dimensions[1]) / 2;

      if (this.tileTo[0] != this.tileFrom[0]) {
        var diff = (this.tileW / this.delayMove) * (t - this.timeMoved);
        this.position[0] += this.tileTo[0] < this.tileFrom[0] ? 0 - diff : diff;
      }
      if (this.tileTo[1] != this.tileFrom[1]) {
        var diff = (this.tileH / this.delayMove) * (t - this.timeMoved);
        this.position[1] += this.tileTo[1] < this.tileFrom[1] ? 0 - diff : diff;
      }

      this.position[0] = Math.round(this.position[0]);
      this.position[1] = Math.round(this.position[1]);
    }

    return true;
  }

  canMoveTo(x, y) {
    if (x < 0 || x >= this.mapW || y < 0 || y >= this.mapH) {
      return false;
    }

    if (
      this.tileTypes[this.gameMap[this.toIndex(x, y)]].floor !=
        this.floorTypes.path &&
      this.tileTypes[this.gameMap[this.toIndex(x, y)]].floor !=
        this.floorTypes.ice &&
      this.tileTypes[this.gameMap[this.toIndex(x, y)]].floor !=
        this.floorTypes.conveyorU &&
      this.tileTypes[this.gameMap[this.toIndex(x, y)]].floor !=
        this.floorTypes.conveyorD &&
      this.tileTypes[this.gameMap[this.toIndex(x, y)]].floor !=
        this.floorTypes.conveyorL &&
      this.tileTypes[this.gameMap[this.toIndex(x, y)]].floor !=
        this.floorTypes.conveyorR
    ) {
      return false;
    }

    return true;
  }

  canMoveUp() {
    return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] - 1);
  }
  canMoveDown() {
    return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] + 1);
  }
  canMoveLeft() {
    return this.canMoveTo(this.tileFrom[0] - 1, this.tileFrom[1]);
  }
  canMoveRight() {
    return this.canMoveTo(this.tileFrom[0] + 1, this.tileFrom[1]);
  }

  canMoveDirection(d) {
    switch (d) {
      case this.directions.up:
        return this.canMoveUp();
      case this.directions.down:
        return this.canMoveDown();
      case this.directions.left:
        return this.canMoveLeft();
      default:
        return this.canMoveRight();
    }
  }

  moveDirection(d, t) {
    switch (d) {
      case this.directions.up:
        return this.moveUp(t);
      case this.directions.down:
        return this.moveDown(t);
      case this.directions.left:
        return this.moveLeft(t);
      default:
        return this.moveRight(t);
    }
  }

  moveLeft(t) {
    this.tileTo[0] -= 1;
    this.timeMoved = t;
    this.direction = this.directions.left;
  }
  moveRight(t) {
    this.tileTo[0] += 1;
    this.timeMoved = t;
    this.direction = this.directions.right;
  }
  moveUp(t) {
    this.tileTo[1] -= 1;
    this.timeMoved = t;
    this.direction = this.directions.up;
  }
  moveDown(t) {
    this.tileTo[1] += 1;
    this.timeMoved = t;
    this.direction = this.directions.down;
  }

  toIndex(x, y) {
    return y * this.mapW + x;
  }
}

export default Character;
