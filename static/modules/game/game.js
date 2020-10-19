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
  constructor() {
    this.playerNotMoving = false;
  }

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
      width: 320,
      height: 320,
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
    canvas.ctx.font = "10px Arial";
    for (var i = 0; i < this.player.inventory.spaces; i++) {
      canvas.ctx.fillStyle = "#ddccaa";
      canvas.ctx.fillRect(
        i * 33,
        367,
        SETTINGS.tiles.width,
        SETTINGS.tiles.height
      );
      if (typeof this.player.inventory.stacks[i] != "undefined") {
        var it = itemTypes[this.player.inventory.stacks[i].type];

        it.sprite.draw(
          controller.gameTime,
          i * 33 + it.offset[0],
          367 + it.offset[1]
        );

        if (this.player.inventory.stacks[i].qty > 1) {
          canvas.ctx.fillStyle = "#ffffff";
          canvas.ctx.fillText(
            "" + this.player.inventory.stacks[i].qty,
            i * 33 + 30,
            367 + 30
          );
        }
      }
    }
  }

  drawGameInformation() {
    canvas.ctx.textAlign = "left";
    canvas.ctx.fillStyle = "#ff0000";
    canvas.ctx.font = "12px Arial";
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
          //Seem to be the most CPU costly approach, but how do we render more smooth darkness?
          /* this.drawMapLightningTiles(x, y, z); */
          /* this.debugDrawCoordinates(x, y); */
        }
      }
      this.drawMapPlayer(z);
    }

    /* this.lightningTest1(10); */
    /* this.lightningTest2(); */
  }

  lightningTest2() {
    //!Probably the best balance between most cost effective/good looking
    //!But might get problematic if light position needs to be animated?
    var cvs = canvas.element;
    var ctx = cvs.getContext("2d");

    var x = cvs.width / 2,
      y = cvs.height / 2,
      // Radii of the white glow.
      innerRadius = 20,
      outerRadius = 200,
      // Radius of the entire circle.
      radius = 500;

    var gradient = ctx.createRadialGradient(
      x,
      y,
      innerRadius,
      x,
      y,
      outerRadius
    );
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(1, "rgba(0,0,0,0.95)");

    ctx.arc(x, y, radius, 0, 2 * Math.PI);

    ctx.fillStyle = gradient;
    ctx.fill();
  }
  lightningTest1(pixels) {
    //Lighting
    for (var y = 0; y <= canvas.element.height / pixels; ++y) {
      for (var x = 0; x <= canvas.element.width / pixels; ++x) {
        this.drawMapLightningCanvas(x, y, pixels);
      }
    }
  }

  drawVoid() {
    canvas.ctx.fillStyle = "#000000";
    canvas.ctx.fillRect(0, 0, this.viewport.screen[0], this.viewport.screen[1]);
  }

  debugDrawCoordinates(x, y) {
    //Write x:y coords on map
    const vx = this.viewport.offset[0] + x * SETTINGS.tiles.width;
    const vy = this.viewport.offset[1] + y * SETTINGS.tiles.height;

    canvas.ctx.textAlign = "center";
    canvas.ctx.font = "10px Arial";
    canvas.ctx.fillStyle = "#ff0000";
    canvas.ctx.fillText(
      `${x}:${y}`,
      vx + SETTINGS.tiles.width / 2,
      vy + SETTINGS.tiles.height / 2
    );
  }

  drawMapLightningTiles(x, y, z) {
    if (z !== 3) return;
    const px = this.viewport.offset[0] + this.player.position[0];
    const py = this.viewport.offset[1] + this.player.position[1];
    const vx = this.viewport.offset[0] + x * SETTINGS.tiles.width;
    const vy = this.viewport.offset[1] + y * SETTINGS.tiles.height;
    const opacity = utils.distanceTo([vx, vy], [px, py]) / 300;
    canvas.ctx.fillStyle = `rgba(0,0,0,${opacity})`;
    canvas.ctx.fillRect(vx, vy, SETTINGS.tiles.width, SETTINGS.tiles.height);
  }
  drawMapLightningCanvas(x, y, pixels) {
    const lightingPos = [x * pixels, y * pixels];
    const playerPos = [canvas.element.width / 2, canvas.element.height / 2];

    const opacity = utils.distanceTo(lightingPos, playerPos) / 200;

    canvas.ctx.fillStyle = `rgba(0,0,0,${opacity})`;
    canvas.ctx.fillRect(lightingPos[0], lightingPos[1], pixels, pixels);
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
    if (o != null) {
      var ot = objectTypes[o.type];

      if (Array.isArray(ot.sprite)) {
        ot.sprite.forEach((s) => {
          if (z === s.zIndex) {
            s.sprite.draw(
              controller.gameTime,
              this.viewport.offset[0] + x * SETTINGS.tiles.width + s.offset[0],
              this.viewport.offset[1] + y * SETTINGS.tiles.height + s.offset[1]
            );
          }
        });
        //Kontrollera olika delar av terräng, olika z index beroende på del exempelvis 4 sprite träd
      } else {
        if (objectTypes[o.type].zIndex == z) {
          ot.sprite.draw(
            controller.gameTime,
            this.viewport.offset[0] + x * SETTINGS.tiles.width + ot.offset[0],
            this.viewport.offset[1] + y * SETTINGS.tiles.height + ot.offset[1]
          );
        }
      }
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
    /* if (z !== 1) return; */
    if (Array.isArray(this.player.sprites[this.player.direction])) {
      this.player.sprites[this.player.direction].forEach((s) => {
        if (z === s.zIndex) {
          s.sprite.draw(
            controller.gameTime,
            this.viewport.offset[0] + this.player.position[0] + s.offset[0],
            this.viewport.offset[1] + this.player.position[1] + s.offset[1],
            this.playerNotMoving
          );
        }
      });
    } else {
      if (z === 1) {
        this.player.sprites[this.player.direction].draw(
          controller.gameTime,
          this.viewport.offset[0] + this.player.position[0],
          this.viewport.offset[1] + this.player.position[1]
        );
      }
    }
  }

  handlePlayerActions() {
    const game = {
      paused: controller.isPaused(),
      time: controller.gameTime,
    };
    this.playerNotMoving =
      !this.player.processMovement(game.time) && !game.paused;

    if (this.playerNotMoving) {
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
