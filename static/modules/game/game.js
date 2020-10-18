import Character from "../character/character";
import Viewport from "../viewport";
import KeyboardController from "../controls/keyboardController";

//Data imports
import itemTypes from "../items/data/itemTypes";
import objectTypes from "../objects/data/objectTypes";
import tileTypes from "../tiles/data/tileTypes";
import utils from "../utils";

//Singleton
import canvas from "../canvas";
import tileset from "../tiles/tileset";
import tilemap from "../tiles/tilemap";
import controller from "./controller";
import test from "../test";

//JSON
import SETTINGS from "../mapSettings.json";
class Game {
  constructor() {}

  runGame() {
    if (canvas.ctx === null) return console.error("CTX is null");
    if (!tileset.loaded) return requestAnimationFrame(() => this.runGame());

    controller.setTime();
    controller.countFrame();

    this.handlePlayerActions();

    this.drawVoid();
    this.drawGame();
    this.drawPlayerInventory();
    this.drawGameInformation();

    controller.setLastFrameTime();
    requestAnimationFrame(() => this.runGame());
  }

  initialize() {
    canvas.initialize({
      element: document.querySelector("#cvs"),
      width: 400,
      height: 400,
    });

    this.keyboard = new KeyboardController();
    this.player = new Character();
    this.viewport = new Viewport({
      canvasW: canvas.element.width,
      canvasH: canvas.element.height,
    });

    test.createObjects();
    test.createItems();

    requestAnimationFrame(() => this.runGame());
  }

  drawPlayerInventory() {
    canvas.ctx.textAlign = "right";
    for (var i = 0; i < this.player.inventory.spaces; i++) {
      canvas.ctx.fillStyle = "#ddccaa";
      canvas.ctx.fillRect(10 + i * 50, 350, 40, 40);
      if (typeof this.player.inventory.stacks[i] != "undefined") {
        var it = itemTypes[this.player.inventory.stacks[i].type];

        it.sprite.draw(
          controller.gameTime,
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
  }

  drawGameInformation() {
    canvas.ctx.textAlign = "left";
    canvas.ctx.fillStyle = "#ff0000";
    canvas.ctx.fillText(`FPS: ${controller.getGameFPS()}`, 10, 20);
    canvas.ctx.fillText(`Gamespeed: ${controller.getGameSpeed()}`, 10, 40);
  }

  drawGame() {
    //Draw map
    const levels = tilemap.levels;
    const viewport = {
      startX: this.viewport.startTile[0],
      startY: this.viewport.startTile[1],
      endX: this.viewport.endTile[0],
      endY: this.viewport.endTile[1],
    };

    for (var z = 0; z < levels; z++) {
      for (var y = viewport.startY; y <= viewport.endY; ++y) {
        for (var x = viewport.startX; x <= viewport.endX; ++x) {
          this.drawMapFloors(x, y, z);
          this.drawMapItems(x, y, z);
          this.drawMapTerrain(x, y, z);
          this.drawMapRoofs(x, y, z);
        }
      }
      this.drawMapPlayer(z);
    }
  }

  drawVoid() {
    canvas.ctx.fillStyle = "#000000";
    canvas.ctx.fillRect(0, 0, this.viewport.screen[0], this.viewport.screen[1]);
  }

  drawMapFloors(x, y, z) {
    if (z !== 0) return;
    tileTypes[tilemap.map[utils.toIndex(x, y)].type].sprite.draw(
      controller.gameTime,
      this.viewport.offset[0] + x * SETTINGS.tiles.width,
      this.viewport.offset[1] + y * SETTINGS.tiles.height
    );
  }
  drawMapItems(x, y, z) {
    if (z !== 1) return;
    var is = tilemap.map[utils.toIndex(x, y)].itemStack;
    if (is != null) {
      itemTypes[is.type].sprite.draw(
        controller.gameTime,
        this.viewport.offset[0] +
          x * SETTINGS.tiles.width +
          itemTypes[is.type].offset[0],
        this.viewport.offset[1] +
          y * SETTINGS.tiles.height +
          itemTypes[is.type].offset[1]
      );
    }
  }
  drawMapTerrain(x, y, z) {
    var o = tilemap.map[utils.toIndex(x, y)].object;
    if (o != null && objectTypes[o.type].zIndex == z) {
      var ot = objectTypes[o.type];

      ot.sprite.draw(
        controller.gameTime,
        this.viewport.offset[0] + x * SETTINGS.tiles.width + ot.offset[0],
        this.viewport.offset[1] + y * SETTINGS.tiles.height + ot.offset[1]
      );
    }
  }
  drawMapRoofs(x, y, z) {
    //Not sure if this is a scalable solution for roofs
    var playerRoof1 =
      tilemap.map[
        utils.toIndex(this.player.tileFrom[0], this.player.tileFrom[1])
      ].roof;
    var playerRoof2 =
      tilemap.map[utils.toIndex(this.player.tileTo[0], this.player.tileTo[1])]
        .roof;
    if (
      z == 2 &&
      tilemap.map[utils.toIndex(x, y)].roofType != 0 &&
      tilemap.map[utils.toIndex(x, y)].roof != playerRoof1 &&
      tilemap.map[utils.toIndex(x, y)].roof != playerRoof2
    ) {
      tileTypes[tilemap.map[utils.toIndex(x, y)].roofType].sprite.draw(
        controller.gameTime,
        this.viewport.offset[0] + x * SETTINGS.tiles.width,
        this.viewport.offset[1] + y * SETTINGS.tiles.height
      );
    }
  }

  drawMapPlayer(z) {
    if (z !== 1) return;
    this.player.sprites[this.player.direction].draw(
      controller.gameTime,
      this.viewport.offset[0] + this.player.position[0],
      this.viewport.offset[1] + this.player.position[1]
    );
  }

  handlePlayerActions() {
    const game = {
      paused: controller.isPaused(),
      time: controller.gameTime,
    };
    const playerNotMoving =
      !this.player.processMovement(game.time) && !game.paused;

    if (playerNotMoving) {
      if (this.keyboard.keyDown[38] && this.player.canMoveUp()) {
        this.player.moveUp(game.time);
      } else if (this.keyboard.keyDown[40] && this.player.canMoveDown()) {
        this.player.moveDown(game.time);
      } else if (this.keyboard.keyDown[37] && this.player.canMoveLeft()) {
        this.player.moveLeft(game.time);
      } else if (this.keyboard.keyDown[39] && this.player.canMoveRight()) {
        this.player.moveRight(game.time);
      } else if (this.keyboard.keyDown[80]) {
        this.player.pickUp();
      }
    }
    this.updateViewport();
  }

  updateViewport() {
    this.viewport.update(
      this.player.position[0] + this.player.dimensions[0] / 2,
      this.player.position[1] + this.player.dimensions[1] / 2
    );
  }
}

export default Game;
