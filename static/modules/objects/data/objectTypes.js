import Sprite from "../../sprite";
import objectCollision from "./objectCollision";
const spriteSheetName = "nature";
export default {
  1: {
    name: "Stone",
    sprite: new Sprite([{ x: 416, y: 1408, w: 32, h: 32 }], spriteSheetName),
    offset: [0, 0],
    collision: objectCollision.solid,
    zIndex: 1,
  },
  2: {
    name: "Flower",
    sprite: new Sprite([{ x: 32, y: 0, w: 40, h: 40 }], spriteSheetName),
    offset: [0, 0],
    collision: objectCollision.none,
    zIndex: 1,
  },
  3: {
    name: "Tree top",
    sprite: new Sprite([{ x: 80, y: 160, w: 80, h: 80 }], spriteSheetName),
    offset: [-20, -20],
    collision: objectCollision.solid,
    zIndex: 3,
  },
  4: {
    name: "Tree",
    sprite: [
      {
        sprite: new Sprite([{ x: 0, y: 480, w: 32, h: 32 }], spriteSheetName),
        offset: [-32, -32],
        zIndex: 3,
      },
      {
        sprite: new Sprite([{ x: 32, y: 480, w: 32, h: 32 }], spriteSheetName),
        offset: [0, -32],
        zIndex: 3,
      },
      {
        sprite: new Sprite([{ x: 0, y: 512, w: 32, h: 32 }], spriteSheetName),
        offset: [-32, 0],
        zIndex: 3,
      },
      {
        sprite: new Sprite([{ x: 32, y: 512, w: 32, h: 32 }], spriteSheetName),
        offset: [0, 0],
        zIndex: 1,
      },
    ],
    offset: [-32, -32],
    collision: objectCollision.solid,
    zIndex: 3,
  },
};
