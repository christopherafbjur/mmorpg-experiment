import Sprite from "../../sprite";
import floorTypes from "./floorTypes";
const spriteSheetName = "tiles";
export default {
  0: {
    colour: "#685b48",
    floor: floorTypes.solid,
    sprite: new Sprite([{ x: 0, y: 0, w: 40, h: 40 }], spriteSheetName),
  },
  1: {
    colour: "#5aa457",
    floor: floorTypes.grass,
    sprite: new Sprite([{ x: 192, y: 32, w: 32, h: 32 }], spriteSheetName),
  },
  2: {
    colour: "#e8bd7a",
    floor: floorTypes.path,
    sprite: new Sprite([{ x: 80, y: 0, w: 40, h: 40 }], spriteSheetName),
  },
  3: {
    colour: "#286625",
    floor: floorTypes.solid,
    sprite: new Sprite([{ x: 120, y: 0, w: 40, h: 40 }], spriteSheetName),
  },
  4: {
    colour: "#678fd9",
    floor: floorTypes.water,
    sprite: new Sprite(
      [
        { x: 160, y: 0, w: 40, h: 40, d: 200 },
        { x: 200, y: 0, w: 40, h: 40, d: 200 },
        { x: 160, y: 40, w: 40, h: 40, d: 200 },
        { x: 200, y: 40, w: 40, h: 40, d: 200 },
        { x: 160, y: 40, w: 40, h: 40, d: 200 },
        { x: 200, y: 0, w: 40, h: 40, d: 200 },
      ],
      spriteSheetName
    ),
  },
  5: {
    colour: "#eeeeff",
    floor: floorTypes.ice,
    sprite: new Sprite([{ x: 120, y: 120, w: 40, h: 40 }], spriteSheetName),
  },
  6: {
    colour: "#cccccc",
    floor: floorTypes.conveyorL,
    sprite: new Sprite(
      [
        { x: 0, y: 40, w: 40, h: 40, d: 200 },
        { x: 40, y: 40, w: 40, h: 40, d: 200 },
        { x: 80, y: 40, w: 40, h: 40, d: 200 },
        { x: 120, y: 40, w: 40, h: 40, d: 200 },
      ],
      spriteSheetName
    ),
  },
  7: {
    colour: "#cccccc",
    floor: floorTypes.conveyorR,
    sprite: new Sprite(
      [
        { x: 120, y: 80, w: 40, h: 40, d: 200 },
        { x: 80, y: 80, w: 40, h: 40, d: 200 },
        { x: 40, y: 80, w: 40, h: 40, d: 200 },
        { x: 0, y: 80, w: 40, h: 40, d: 200 },
      ],
      spriteSheetName
    ),
  },
  8: {
    colour: "#cccccc",
    floor: floorTypes.conveyorD,
    sprite: new Sprite(
      [
        { x: 160, y: 200, w: 40, h: 40, d: 200 },
        { x: 160, y: 160, w: 40, h: 40, d: 200 },
        { x: 160, y: 120, w: 40, h: 40, d: 200 },
        { x: 160, y: 80, w: 40, h: 40, d: 200 },
      ],
      spriteSheetName
    ),
  },
  9: {
    colour: "#cccccc",
    floor: floorTypes.conveyorU,
    sprite: new Sprite(
      [
        { x: 200, y: 80, w: 40, h: 40, d: 200 },
        { x: 200, y: 120, w: 40, h: 40, d: 200 },
        { x: 200, y: 160, w: 40, h: 40, d: 200 },
        { x: 200, y: 200, w: 40, h: 40, d: 200 },
      ],
      spriteSheetName
    ),
  },
  10: {
    colour: "#ccaa00",
    floor: floorTypes.solid,
    sprite: new Sprite([{ x: 40, y: 120, w: 40, h: 40 }], spriteSheetName),
  },
  11: {
    colour: "#ccaa00",
    floor: floorTypes.solid,
    sprite: new Sprite([{ x: 80, y: 120, w: 40, h: 40 }], spriteSheetName),
  },
};
