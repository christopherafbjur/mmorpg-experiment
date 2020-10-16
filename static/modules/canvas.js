import Character from "./character";
import Viewport from "./viewport";
import Tileset from "./tileset";
import TileMap from "./tilemap";
import GameMap from "./map";
import MapObject from "./mapobject";
import utils from "./utils";
class Canvas {
  constructor(params) {
    const { tiles, dimensions } = params.map;
    this.element = document.querySelector("#cvs");
    this.ctx = this.element.getContext("2d");

    this.tileW = tiles.width;
    this.tileH = tiles.height;
    this.mapW = dimensions.horizontalTilesAmount;
    this.mapH = dimensions.verticalTilesAmount;

    this.currentSecond = 0;
    this.frameCount = 0;
    this.framesLastSecond = 0;

    this.lastFrameTime = 0;

    this.keysDown = {
      37: false,
      38: false,
      39: false,
      40: false,
    };

    this.gameTime = 0;
    this.gameSpeeds = [
      { name: "Normal", mult: 1 },
      { name: "Slow", mult: 0.3 },
      { name: "Fast", mult: 3 },
      { name: "Paused", mult: 0 },
    ];
    this.currentSpeed = 0;

    //game objects start
    this.objectCollision = {
      none: 0,
      solid: 1,
    };

    this.objectTypes = {
      1: {
        name: "Box",
        sprite: [{ x: 40, y: 160, w: 40, h: 40 }],
        offset: [0, 0],
        collision: this.objectCollision.solid,
        zIndex: 1,
      },
      2: {
        name: "Broken Box",
        sprite: [{ x: 40, y: 200, w: 40, h: 40 }],
        offset: [0, 0],
        collision: this.objectCollision.none,
        zIndex: 1,
      },
      3: {
        name: "Tree top",
        sprite: [{ x: 80, y: 160, w: 80, h: 80 }],
        offset: [-20, -20],
        collision: this.objectCollision.solid,
        zIndex: 3,
      },
    };

    //game objects end

    this.floorTypes = {
      solid: 0,
      path: 1,
      water: 2,
      ice: 3,
      conveyorU: 4,
      conveyorD: 5,
      conveyorL: 6,
      conveyorR: 7,
      grass: 8,
    };

    this.tileTypes = {
      0: {
        colour: "#685b48",
        floor: this.floorTypes.solid,
        sprite: [{ x: 0, y: 0, w: 40, h: 40 }],
      },
      1: {
        colour: "#5aa457",
        floor: this.floorTypes.grass,
        sprite: [{ x: 40, y: 0, w: 40, h: 40 }],
      },
      2: {
        colour: "#e8bd7a",
        floor: this.floorTypes.path,
        sprite: [{ x: 80, y: 0, w: 40, h: 40 }],
      },
      3: {
        colour: "#286625",
        floor: this.floorTypes.solid,
        sprite: [{ x: 120, y: 0, w: 40, h: 40 }],
      },
      4: {
        colour: "#678fd9",
        floor: this.floorTypes.water,
        sprite: [
          { x: 160, y: 0, w: 40, h: 40, d: 200 },
          { x: 200, y: 0, w: 40, h: 40, d: 200 },
          { x: 160, y: 40, w: 40, h: 40, d: 200 },
          { x: 200, y: 40, w: 40, h: 40, d: 200 },
          { x: 160, y: 40, w: 40, h: 40, d: 200 },
          { x: 200, y: 0, w: 40, h: 40, d: 200 },
        ],
      },
      5: {
        colour: "#eeeeff",
        floor: this.floorTypes.ice,
        sprite: [{ x: 120, y: 120, w: 40, h: 40 }],
      },
      6: {
        colour: "#cccccc",
        floor: this.floorTypes.conveyorL,
        sprite: [
          { x: 0, y: 40, w: 40, h: 40, d: 200 },
          { x: 40, y: 40, w: 40, h: 40, d: 200 },
          { x: 80, y: 40, w: 40, h: 40, d: 200 },
          { x: 120, y: 40, w: 40, h: 40, d: 200 },
        ],
      },
      7: {
        colour: "#cccccc",
        floor: this.floorTypes.conveyorR,
        sprite: [
          { x: 120, y: 80, w: 40, h: 40, d: 200 },
          { x: 80, y: 80, w: 40, h: 40, d: 200 },
          { x: 40, y: 80, w: 40, h: 40, d: 200 },
          { x: 0, y: 80, w: 40, h: 40, d: 200 },
        ],
      },
      8: {
        colour: "#cccccc",
        floor: this.floorTypes.conveyorD,
        sprite: [
          { x: 160, y: 200, w: 40, h: 40, d: 200 },
          { x: 160, y: 160, w: 40, h: 40, d: 200 },
          { x: 160, y: 120, w: 40, h: 40, d: 200 },
          { x: 160, y: 80, w: 40, h: 40, d: 200 },
        ],
      },
      9: {
        colour: "#cccccc",
        floor: this.floorTypes.conveyorU,
        sprite: [
          { x: 200, y: 80, w: 40, h: 40, d: 200 },
          { x: 200, y: 120, w: 40, h: 40, d: 200 },
          { x: 200, y: 160, w: 40, h: 40, d: 200 },
          { x: 200, y: 200, w: 40, h: 40, d: 200 },
        ],
      },
      10: {
        colour: "#ccaa00",
        floor: this.floorTypes.solid,
        sprite: [{ x: 40, y: 120, w: 40, h: 40 }],
      },
      11: {
        colour: "#ccaa00",
        floor: this.floorTypes.solid,
        sprite: [{ x: 80, y: 120, w: 40, h: 40 }],
      },
    };

    //Automatically set sprite duration based on available sprites
    Object.keys(this.tileTypes).forEach((x) => {
      console.log(this.tileTypes[x]);
      this.tileTypes[x]["animated"] = this.tileTypes[x].sprite.length > 1;
      if (this.tileTypes[x]["animated"]) {
        var t = 0;
        this.tileTypes[x].sprite.forEach((sprite) => {
          sprite["start"] = t;

          t += sprite.d;

          sprite["end"] = t;
        });
        this.tileTypes[x]["spriteDuration"] = t;
      }
    });

    this.directions = {
      up: 0,
      right: 1,
      down: 2,
      left: 3,
    };

    this.gameMap = GameMap;

    //prettier-ignore
    this.roofList = [
      { x:5, y:3, w:4, h:7, data: [
        10, 10, 11, 11,
        10, 10, 11, 11,
        10, 10, 11, 11,
        10, 10, 11, 11,
        10, 10, 11, 11,
        10, 10, 11, 11,
        10, 10, 11, 11
      ]},
      { x:15, y:5, w:5, h:4, data: [
        10, 10, 11, 11, 11,
        10, 10, 11, 11, 11,
        10, 10, 11, 11, 11,
        10, 10, 11, 11, 11
      ]},
      { x:14, y:9, w:6, h:7, data: [
        10, 10, 10, 11, 11, 11,
        10, 10, 10, 11, 11, 11,
        10, 10, 10, 11, 11, 11,
        10, 10, 10, 11, 11, 11,
        10, 10, 10, 11, 11, 11,
        10, 10, 10, 11, 11, 11,
        10, 10, 10, 11, 11, 11
      ]}
    ];

    //Build tilemap from data
    this.mapTileData = new TileMap();
    this.mapTileData.buildMapFromData(this.gameMap, this.mapW, this.mapH);
    this.mapTileData.addRoofs(this.roofList);
    this.mapTileData.map[2 * this.mapW + 2].eventEnter = function () {
      console.log("Entered tile 2,2");
    };

    //Add some objects on our map
    this.createTestObjects();

    this.player = new Character({
      ...params,
      floorTypes: this.floorTypes,
      tileTypes: this.tileTypes,
      tileEvents: this.tileEvents,
      directions: this.directions,
      mapTileData: this.mapTileData,
      objectTypes: this.objectTypes,
      objectCollision: this.objectCollision,
    });
    this.tileset = new Tileset();
  }

  createTestObjects() {
    var mo1 = new MapObject({ type: 1, mapTileData: this.mapTileData });
    mo1.placeAt(2, 4);
    var mo2 = new MapObject({ type: 2, mapTileData: this.mapTileData });
    mo2.placeAt(2, 3);

    var mo11 = new MapObject({ type: 1, mapTileData: this.mapTileData });
    mo11.placeAt(6, 4);
    var mo12 = new MapObject({ type: 2, mapTileData: this.mapTileData });
    mo12.placeAt(7, 4);

    var mo4 = new MapObject({ type: 3, mapTileData: this.mapTileData });
    mo4.placeAt(4, 5);
    var mo5 = new MapObject({ type: 3, mapTileData: this.mapTileData });
    mo5.placeAt(4, 8);
    var mo6 = new MapObject({ type: 3, mapTileData: this.mapTileData });
    mo6.placeAt(4, 11);

    var mo7 = new MapObject({ type: 3, mapTileData: this.mapTileData });
    mo7.placeAt(2, 6);
    var mo8 = new MapObject({ type: 3, mapTileData: this.mapTileData });
    mo8.placeAt(2, 9);
    var mo9 = new MapObject({ type: 3, mapTileData: this.mapTileData });
    mo9.placeAt(2, 12);
  }

  toIndex(x, y) {
    return y * this.mapW + x;
  }

  getFrame(sprite, duration, time, animated) {
    if (!animated) return sprite[0];
    time = time % duration;
    return sprite.find((x) => x.end >= time);
  }

  drawGame() {
    if (this.ctx === null) return console.error("CTX is null");
    if (!this.tileset.loaded)
      return requestAnimationFrame(() => this.drawGame());

    var currentFrameTime = Date.now();
    var timeElapsed = currentFrameTime - this.lastFrameTime;
    this.gameTime += Math.floor(
      timeElapsed * this.gameSpeeds[this.currentSpeed].mult
    );

    var sec = Math.floor(Date.now() / 1000);
    if (sec !== this.currentSecond) {
      this.currentSecond = sec;
      this.framesLastSecond = this.frameCount;
      this.frameCount = 1;
    } else {
      this.frameCount++;
    }
    var gameIsPaused = this.gameSpeeds[this.currentSpeed].mult === 0;
    if (!this.player.processMovement(this.gameTime) && !gameIsPaused) {
      if (this.keysDown[38] && this.player.canMoveUp()) {
        this.player.moveUp(this.gameTime);
      } else if (this.keysDown[40] && this.player.canMoveDown()) {
        this.player.moveDown(this.gameTime);
      } else if (this.keysDown[37] && this.player.canMoveLeft()) {
        this.player.moveLeft(this.gameTime);
      } else if (this.keysDown[39] && this.player.canMoveRight()) {
        this.player.moveRight(this.gameTime);
      }
    }

    this.viewport.update(
      this.player.position[0] + this.player.dimensions[0] / 2,
      this.player.position[1] + this.player.dimensions[1] / 2
    );

    var playerRoof1 = this.mapTileData.map[
      utils.toIndex(this.player.tileFrom[0], this.player.tileFrom[1])
    ].roof;
    var playerRoof2 = this.mapTileData.map[
      utils.toIndex(this.player.tileTo[0], this.player.tileTo[1])
    ].roof;

    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.viewport.screen[0], this.viewport.screen[1]);

    console.log(
      this.viewport.startTile[1],
      this.viewport.endTile[1],
      this.viewport.startTile[0],
      this.viewport.endTile[0]
    );

    //Draw map
    for (var z = 0; z < this.mapTileData.levels; z++) {
      for (
        var y = this.viewport.startTile[1];
        y <= this.viewport.endTile[1];
        ++y
      ) {
        for (
          var x = this.viewport.startTile[0];
          x <= this.viewport.endTile[0];
          ++x
        ) {
          if (z == 0) {
            var tile = this.tileTypes[
              this.mapTileData.map[utils.toIndex(x, y)].type
            ];

            var sprite = this.getFrame(
              tile.sprite,
              tile.spriteDuration,
              this.gameTime,
              tile.animated
            );
            this.ctx.drawImage(
              this.tileset.image,
              sprite.x,
              sprite.y,
              sprite.w,
              sprite.h,
              this.viewport.offset[0] + x * this.tileW,
              this.viewport.offset[1] + y * this.tileH,
              this.tileW,
              this.tileH
            );
          }

          var o = this.mapTileData.map[utils.toIndex(x, y)].object;
          if (o != null && this.objectTypes[o.type].zIndex == z) {
            var ot = this.objectTypes[o.type];

            this.ctx.drawImage(
              this.tileset.image,
              ot.sprite[0].x,
              ot.sprite[0].y,
              ot.sprite[0].w,
              ot.sprite[0].h,
              this.viewport.offset[0] + x * this.tileW + ot.offset[0],
              this.viewport.offset[1] + y * this.tileH + ot.offset[1],
              ot.sprite[0].w,
              ot.sprite[0].h
            );
          }

          if (
            z == 2 &&
            this.mapTileData.map[utils.toIndex(x, y)].roofType != 0 &&
            this.mapTileData.map[utils.toIndex(x, y)].roof != playerRoof1 &&
            this.mapTileData.map[utils.toIndex(x, y)].roof != playerRoof2
          ) {
            tile = this.tileTypes[
              this.mapTileData.map[utils.toIndex(x, y)].roofType
            ];
            sprite = this.getFrame(
              tile.sprite,
              tile.spriteDuration,
              this.gameTime,
              tile.animated
            );
            this.ctx.drawImage(
              this.tileset.image,
              sprite.x,
              sprite.y,
              sprite.w,
              sprite.h,
              this.viewport.offset[0] + x * this.tileW,
              this.viewport.offset[1] + y * this.tileH,
              this.tileW,
              this.tileH
            );
          }
        }
      }

      if (z == 1) {
        var sprite = this.player.sprites[this.player.direction];
        this.ctx.drawImage(
          this.tileset.image,
          sprite[0].x,
          sprite[0].y,
          sprite[0].w,
          sprite[0].h,
          this.viewport.offset[0] + this.player.position[0],
          this.viewport.offset[1] + this.player.position[1],
          this.player.dimensions[0],
          this.player.dimensions[1]
        );
      }
    }

    //Draw fps info
    this.ctx.fillStyle = "#ff0000";
    this.ctx.fillText(`FPS: ${this.framesLastSecond}`, 10, 20);
    this.ctx.fillText(
      `Gamespeed: ${this.gameSpeeds[this.currentSpeed].name}`,
      10,
      40
    );

    this.lastFrameTime = currentFrameTime;
    requestAnimationFrame(() => this.drawGame());
  }

  initialize() {
    /* this.element.width = this.tileW * this.mapW;
    this.element.height = this.tileH * this.mapH; */

    //Initialize canvas dimensions & font
    this.element.width = 400;
    this.element.height = 400;
    this.ctx.font = "bold 10pt sans-serif";

    //Initialize viewport
    this.viewport = new Viewport({
      canvasW: this.element.width,
      canvasH: this.element.height,
      tileW: this.tileW,
      tileH: this.tileH,
      mapW: this.mapW,
      mapH: this.mapH,
    });

    //Init event listeners for player movement
    window.addEventListener("keydown", (e) => {
      if (e.keyCode >= 37 && e.keyCode <= 40) {
        this.keysDown[e.keyCode] = true;
      }
    });
    window.addEventListener("keyup", (e) => {
      if (e.keyCode >= 37 && e.keyCode <= 40) {
        this.keysDown[e.keyCode] = false;
      }
      if (e.keyCode === 83) {
        this.currentSpeed =
          this.currentSpeed >= this.gameSpeeds.length - 1
            ? 0
            : this.currentSpeed + 1;
      }
    });

    requestAnimationFrame(() => this.drawGame());
  }
}

export default Canvas;
