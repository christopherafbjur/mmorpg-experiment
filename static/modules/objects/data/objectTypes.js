import Sprite from "../../sprite";
import objectCollision from "./objectCollision";

export default {
  1: {
    name: "Box",
    sprite: new Sprite([{ x: 40, y: 160, w: 40, h: 40 }]),
    offset: [0, 0],
    collision: objectCollision.solid,
    zIndex: 1,
  },
  2: {
    name: "Broken Box",
    sprite: new Sprite([{ x: 40, y: 200, w: 40, h: 40 }]),
    offset: [0, 0],
    collision: objectCollision.none,
    zIndex: 1,
  },
  3: {
    name: "Tree top",
    sprite: new Sprite([{ x: 80, y: 160, w: 80, h: 80 }]),
    offset: [-20, -20],
    collision: objectCollision.solid,
    zIndex: 3,
  },
};
