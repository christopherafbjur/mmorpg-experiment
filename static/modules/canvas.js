import Character from "./character";
import Viewport from "./viewport";
import TileMap from "./tilemap";
import GameMap from "./map";
import MapObject from "./mapobject";
import PlacedItemStack from "./items/placedItemStack";
import Sprite from "./sprite";

//Data imports
import itemTypes from "./items/data/itemTypes";
import objectTypes from "./objects/data/objectTypes";
import tileTypes from "./tiles/data/tileTypes";
import utils from "./utils";

//Singleton
import ctx from "./ctx";
import tileset from "./tileset";
class Canvas {
  constructor(params) {
    const { tiles, dimensions } = params.map;
    this.element = document.querySelector("#cvs");
    /* this.ctx = this.element.getContext("2d"); */
    ctx.setElement(this.element.getContext("2d"));
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

    //Automatically set sprite duration based on available sprites
    Object.keys(tileTypes).forEach((x) => {
      tileTypes[x]["animated"] = tileTypes[x].sprite.length > 1;
      if (tileTypes[x]["animated"]) {
        var t = 0;
        tileTypes[x].sprite.forEach((sprite) => {
          sprite["start"] = t;

          t += sprite.d;

          sprite["end"] = t;
        });
        tileTypes[x]["spriteDuration"] = t;
      }
    });

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

    //Do something
    for (var i = 3; i < 8; i++) {
      var ps = new PlacedItemStack({
        id: 1,
        quantity: 1,
        mapTileData: this.mapTileData,
      });
      ps.placeAt(i, 1);
    }
    for (var i = 3; i < 8; i++) {
      var ps = new PlacedItemStack({
        id: 1,
        quantity: 1,
        mapTileData: this.mapTileData,
      });
      ps.placeAt(3, i);
    }

    this.player = new Character({
      ...params,
      tileEvents: this.tileEvents,
      mapTileData: this.mapTileData,
    });
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
    if (ctx.element === null) return console.error("CTX is null");
    if (!tileset.loaded) return requestAnimationFrame(() => this.drawGame());

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
      } else if (this.keysDown[80]) {
        this.player.pickUp();
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

    ctx.element.fillStyle = "#000000";
    ctx.element.fillRect(
      0,
      0,
      this.viewport.screen[0],
      this.viewport.screen[1]
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
            tileTypes[
              this.mapTileData.map[utils.toIndex(x, y)].type
            ].sprite.draw(
              this.gameTime,
              this.viewport.offset[0] + x * this.tileW,
              this.viewport.offset[1] + y * this.tileH
            );
          } else if (z === 1) {
            var is = this.mapTileData.map[utils.toIndex(x, y)].itemStack;
            if (is != null) {
              itemTypes[is.type].sprite.draw(
                this.gameTime,
                this.viewport.offset[0] +
                  x * this.tileW +
                  itemTypes[is.type].offset[0],
                this.viewport.offset[1] +
                  y * this.tileH +
                  itemTypes[is.type].offset[1]
              );
            }
          }

          var o = this.mapTileData.map[utils.toIndex(x, y)].object;
          if (o != null && objectTypes[o.type].zIndex == z) {
            var ot = objectTypes[o.type];

            ot.sprite.draw(
              this.gameTime,
              this.viewport.offset[0] + x * this.tileW + ot.offset[0],
              this.viewport.offset[1] + y * this.tileH + ot.offset[1]
            );
          }

          if (
            z == 2 &&
            this.mapTileData.map[utils.toIndex(x, y)].roofType != 0 &&
            this.mapTileData.map[utils.toIndex(x, y)].roof != playerRoof1 &&
            this.mapTileData.map[utils.toIndex(x, y)].roof != playerRoof2
          ) {
            tileTypes[
              this.mapTileData.map[utils.toIndex(x, y)].roofType
            ].sprite.draw(
              this.gameTime,
              this.viewport.offset[0] + x * this.tileW,
              this.viewport.offset[1] + y * this.tileH
            );
          }
        }
      }

      if (z == 1) {
        this.player.sprites[this.player.direction].draw(
          this.gameTime,
          this.viewport.offset[0] + this.player.position[0],
          this.viewport.offset[1] + this.player.position[1]
        );
      }
    } //Closing Z loop

    ctx.element.textAlign = "right";
    for (var i = 0; i < this.player.inventory.spaces; i++) {
      ctx.element.fillStyle = "#ddccaa";
      ctx.element.fillRect(10 + i * 50, 350, 40, 40);
      if (typeof this.player.inventory.stacks[i] != "undefined") {
        var it = itemTypes[this.player.inventory.stacks[i].type];

        it.sprite.draw(
          this.gameTime,
          10 + i * 50 + it.offset[0],
          350 + it.offset[1]
        );

        if (this.player.inventory.stacks[i].qty > 1) {
          ctx.element.fillStyle = "#000000";
          ctx.element.fillText(
            "" + this.player.inventory.stacks[i].qty,
            10 + i * 50 + 38,
            350 + 38
          );
        }
      }
    }
    ctx.element.textAlign = "left";
    //Draw fps info
    ctx.element.fillStyle = "#ff0000";
    ctx.element.fillText(`FPS: ${this.framesLastSecond}`, 10, 20);
    ctx.element.fillText(
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
    ctx.element.font = "bold 10pt sans-serif";

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
      if (e.keyCode === 80) {
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
      if (e.keyCode === 80) {
        this.keysDown[e.keyCode] = false;
      }
    });

    requestAnimationFrame(() => this.drawGame());
  }
}

export default Canvas;
