import GameMap from "./map";
import Inventory from "./items/inventory";
import utils from "./utils";
import objectTypes from "./objects/data/objectTypes";
import objectCollision from "./objects/data/objectCollision";
import tileTypes from "./tiles/data/tileTypes";
import floorTypes from "./tiles/data/floorTypes";
import playerDirections from "./player/data/directions";
import playerSprites from "./player/data/sprites";

class Character {
  constructor(params) {
    //Player movement data
    this.tileFrom = [1, 1];
    this.tileTo = [1, 1];
    this.timeMoved = 0;
    this.dimensions = [30, 30];
    this.position = [45, 45];

    this.direction = playerDirections.up;
    this.sprites = playerSprites;

    //Inventory
    this.inventory = new Inventory(3);

    //Map data
    this.tileW = params.map.tiles.width;
    this.tileH = params.map.tiles.height;
    this.mapW = params.map.dimensions.horizontalTilesAmount;
    this.mapH = params.map.dimensions.verticalTilesAmount;

    this.tileEvents = params.tileEvents;
    this.gameMap = GameMap;
    this.mapTileData = params.mapTileData;

    //Player floor speeds
    this.delayMove = {};
    this.delayMove[floorTypes.path] = 400;
    this.delayMove[floorTypes.grass] = 800;
    this.delayMove[floorTypes.ice] = 300;
    this.delayMove[floorTypes.conveyorU] = 200;
    this.delayMove[floorTypes.conveyorD] = 200;
    this.delayMove[floorTypes.conveyorL] = 200;
    this.delayMove[floorTypes.conveyorR] = 200;
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

    var moveSpeed = this.delayMove[
      tileTypes[
        this.mapTileData.map[utils.toIndex(this.tileFrom[0], this.tileFrom[1])]
          .type
      ].floor
    ];

    if (t - this.timeMoved >= moveSpeed) {
      this.placeAt(this.tileTo[0], this.tileTo[1]);

      //tileevents
      if (
        this.mapTileData.map[utils.toIndex(this.tileTo[0], this.tileTo[1])]
          .eventEnter != null
      ) {
        this.mapTileData.map[
          utils.toIndex(this.tileTo[0], this.tileTo[1])
        ].eventEnter(this);
      }
      //tileevents

      var tileFloor =
        tileTypes[
          this.mapTileData.map[
            utils.toIndex(this.tileFrom[0], this.tileFrom[1])
          ].type
        ].floor;

      if (tileFloor == floorTypes.ice) {
        if (this.canMoveDirection(this.direction)) {
          this.moveDirection(this.direction, t);
        }
      } else if (tileFloor == floorTypes.conveyorL && this.canMoveLeft()) {
        this.moveLeft(t);
      } else if (tileFloor == floorTypes.conveyorR && this.canMoveRight()) {
        this.moveRight(t);
      } else if (tileFloor == floorTypes.conveyorU && this.canMoveUp()) {
        this.moveUp(t);
      } else if (tileFloor == floorTypes.conveyorD && this.canMoveDown()) {
        this.moveDown(t);
      }
    } else {
      this.position[0] =
        this.tileFrom[0] * this.tileW + (this.tileW - this.dimensions[0]) / 2;
      this.position[1] =
        this.tileFrom[1] * this.tileH + (this.tileH - this.dimensions[1]) / 2;

      if (this.tileTo[0] != this.tileFrom[0]) {
        var diff = (this.tileW / moveSpeed) * (t - this.timeMoved);
        this.position[0] += this.tileTo[0] < this.tileFrom[0] ? 0 - diff : diff;
      }
      if (this.tileTo[1] != this.tileFrom[1]) {
        var diff = (this.tileH / moveSpeed) * (t - this.timeMoved);
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
      typeof this.delayMove[
        tileTypes[this.mapTileData.map[utils.toIndex(x, y)].type].floor
      ] == "undefined"
    ) {
      return false;
    }

    if (this.mapTileData.map[utils.toIndex(x, y)].object != null) {
      var o = this.mapTileData.map[utils.toIndex(x, y)].object;
      if (objectTypes[o.type].collision == objectCollision.solid) {
        return false;
      }
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
      case playerDirections.up:
        return this.canMoveUp();
      case playerDirections.down:
        return this.canMoveDown();
      case playerDirections.left:
        return this.canMoveLeft();
      default:
        return this.canMoveRight();
    }
  }

  moveDirection(d, t) {
    switch (d) {
      case playerDirections.up:
        return this.moveUp(t);
      case playerDirections.down:
        return this.moveDown(t);
      case playerDirections.left:
        return this.moveLeft(t);
      default:
        return this.moveRight(t);
    }
  }

  moveLeft(t) {
    this.tileTo[0] -= 1;
    this.timeMoved = t;
    this.direction = playerDirections.left;
  }
  moveRight(t) {
    this.tileTo[0] += 1;
    this.timeMoved = t;
    this.direction = playerDirections.right;
  }
  moveUp(t) {
    this.tileTo[1] -= 1;
    this.timeMoved = t;
    this.direction = playerDirections.up;
  }
  moveDown(t) {
    this.tileTo[1] += 1;
    this.timeMoved = t;
    this.direction = playerDirections.down;
  }

  pickUp() {
    if (
      this.tileTo[0] != this.tileFrom[0] ||
      this.tileTo[1] != this.tileFrom[1]
    ) {
      return false;
    }
    var is = this.mapTileData.map[
      utils.toIndex(this.tileFrom[0], this.tileFrom[1])
    ].itemStack;
    if (is != null) {
      var remains = this.inventory.addItems(is.type, is.qty);
      if (remains) {
        is.qty = remains;
      } else {
        this.mapTileData.map[
          utils.toIndex(this.tileFrom[0], this.tileFrom[1])
        ].itemStack = null;
      }
    }

    return true;
  }
}

export default Character;
