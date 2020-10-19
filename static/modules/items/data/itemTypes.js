import Sprite from "../../sprite";
const spriteSheetName = "equipment";
export default {
  1: {
    name: "Torch",
    maxStack: 10,
    sprite: new Sprite([{ x: 192, y: 1344, w: 32, h: 32 }], spriteSheetName),
    offset: [0, 0],
  },
};
