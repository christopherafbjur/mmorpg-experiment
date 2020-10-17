import Character from "./character/character";
import Viewport from "./viewport";
import TileMap from "./tiles/tilemap";

//Data imports
import itemTypes from "./items/data/itemTypes";
import objectTypes from "./objects/data/objectTypes";
import tileTypes from "./tiles/data/tileTypes";
import utils from "./utils";

//Singleton
import canvas from "./canvas";
import tileset from "./tiles/tileset";
import tilemap from "./tiles/tilemap";
import test from "./test";

//JSON
import SETTINGS from "./mapSettings.json";
class Game {
  constructor() {
    this.gameTime = 0;
    this.gameSpeeds = [
      { name: "Normal", mult: 1 },
      { name: "Slow", mult: 0.3 },
      { name: "Fast", mult: 3 },
      { name: "Paused", mult: 0 },
    ];
    this.currentSpeed = 0;
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
    //Add some objects on our map
    test.createObjects();
    //Add some items on our map
    test.createItems();
    //Create the player
    this.player = new Character();
  }

  getFrame(sprite, duration, time, animated) {
    if (!animated) return sprite[0];
    time = time % duration;
    return sprite.find((x) => x.end >= time);
  }

  drawGame() {
    if (canvas.ctx === null) return console.error("CTX is null");
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

    var playerRoof1 =
      tilemap.map[
        utils.toIndex(this.player.tileFrom[0], this.player.tileFrom[1])
      ].roof;
    var playerRoof2 =
      tilemap.map[utils.toIndex(this.player.tileTo[0], this.player.tileTo[1])]
        .roof;

    canvas.ctx.fillStyle = "#000000";
    canvas.ctx.fillRect(0, 0, this.viewport.screen[0], this.viewport.screen[1]);

    //Draw map
    for (var z = 0; z < tilemap.levels; z++) {
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
            tileTypes[tilemap.map[utils.toIndex(x, y)].type].sprite.draw(
              this.gameTime,
              this.viewport.offset[0] + x * SETTINGS.tiles.width,
              this.viewport.offset[1] + y * SETTINGS.tiles.height
            );
          } else if (z === 1) {
            var is = tilemap.map[utils.toIndex(x, y)].itemStack;
            if (is != null) {
              itemTypes[is.type].sprite.draw(
                this.gameTime,
                this.viewport.offset[0] +
                  x * SETTINGS.tiles.width +
                  itemTypes[is.type].offset[0],
                this.viewport.offset[1] +
                  y * SETTINGS.tiles.height +
                  itemTypes[is.type].offset[1]
              );
            }
          }

          var o = tilemap.map[utils.toIndex(x, y)].object;
          if (o != null && objectTypes[o.type].zIndex == z) {
            var ot = objectTypes[o.type];

            ot.sprite.draw(
              this.gameTime,
              this.viewport.offset[0] + x * SETTINGS.tiles.width + ot.offset[0],
              this.viewport.offset[1] + y * SETTINGS.tiles.height + ot.offset[1]
            );
          }

          if (
            z == 2 &&
            tilemap.map[utils.toIndex(x, y)].roofType != 0 &&
            tilemap.map[utils.toIndex(x, y)].roof != playerRoof1 &&
            tilemap.map[utils.toIndex(x, y)].roof != playerRoof2
          ) {
            tileTypes[tilemap.map[utils.toIndex(x, y)].roofType].sprite.draw(
              this.gameTime,
              this.viewport.offset[0] + x * SETTINGS.tiles.width,
              this.viewport.offset[1] + y * SETTINGS.tiles.height
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

    canvas.ctx.textAlign = "right";
    for (var i = 0; i < this.player.inventory.spaces; i++) {
      canvas.ctx.fillStyle = "#ddccaa";
      canvas.ctx.fillRect(10 + i * 50, 350, 40, 40);
      if (typeof this.player.inventory.stacks[i] != "undefined") {
        var it = itemTypes[this.player.inventory.stacks[i].type];

        it.sprite.draw(
          this.gameTime,
          10 + i * 50 + it.offset[0],
          350 + it.offset[1]
        );

        if (this.player.inventory.stacks[i].qty > 1) {
          canvas.ctx.fillStyle = "#000000";
          canvas.ctx.fillText(
            "" + this.player.inventory.stacks[i].qty,
            10 + i * 50 + 38,
            350 + 38
          );
        }
      }
    }
    canvas.ctx.textAlign = "left";
    //Draw fps info
    canvas.ctx.fillStyle = "#ff0000";
    canvas.ctx.fillText(`FPS: ${this.framesLastSecond}`, 10, 20);
    canvas.ctx.fillText(
      `Gamespeed: ${this.gameSpeeds[this.currentSpeed].name}`,
      10,
      40
    );

    this.lastFrameTime = currentFrameTime;
    requestAnimationFrame(() => this.drawGame());
  }

  initialize() {
    //Initialize canvas dimensions & font
    canvas.initialize({
      element: document.querySelector("#cvs"),
      width: 400,
      height: 400,
    });

    //Initialize viewport
    this.viewport = new Viewport({
      canvasW: canvas.element.width,
      canvasH: canvas.element.height,
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

export default Game;
