import Sprite from "../../sprite";
import directions from "./directions";
const spriteSheetName = "creatures";
export default {
  [directions.up]: [
    {
      sprite: new Sprite(
        [
          { x: 384, y: 64, w: 32, h: 32 },
          { x: 448, y: 64, w: 32, h: 32 },
          { x: 0, y: 128, w: 32, h: 32 },
        ],
        spriteSheetName
      ),
      offset: [-32, -32],
      zIndex: 2,
    },
    {
      sprite: new Sprite(
        [
          { x: 416, y: 64, w: 32, h: 32 },
          { x: 480, y: 64, w: 32, h: 32 },
          { x: 32, y: 128, w: 32, h: 32 },
        ],
        spriteSheetName
      ),
      offset: [0, -32],
      zIndex: 2,
    },
    {
      sprite: new Sprite(
        [
          { x: 384, y: 96, w: 32, h: 32 },
          { x: 448, y: 96, w: 32, h: 32 },
          { x: 0, y: 160, w: 32, h: 32 },
        ],
        spriteSheetName
      ),
      offset: [-32, 0],
      zIndex: 2,
    },
    {
      sprite: new Sprite(
        [
          { x: 416, y: 96, w: 32, h: 32 },
          { x: 480, y: 96, w: 32, h: 32 },
          { x: 32, y: 160, w: 32, h: 32 },
        ],
        spriteSheetName
      ),
      offset: [0, 0],
      zIndex: 1,
    },
  ],
  [directions.right]: [
    {
      sprite: new Sprite(
        [
          { x: 192, y: 64, w: 32, h: 32 },
          { x: 256, y: 64, w: 32, h: 32 },
          { x: 320, y: 64, w: 32, h: 32 },
        ],
        spriteSheetName
      ),
      offset: [-32, -32],
      zIndex: 2,
    },
    {
      sprite: new Sprite(
        [
          { x: 192, y: 96, w: 32, h: 32 },
          { x: 256, y: 96, w: 32, h: 32 },
          { x: 320, y: 96, w: 32, h: 32 },
        ],
        spriteSheetName
      ),
      offset: [-32, 0],
      zIndex: 2,
    },
    {
      sprite: new Sprite(
        [
          { x: 224, y: 64, w: 32, h: 32 },
          { x: 288, y: 64, w: 32, h: 32 },
          { x: 352, y: 64, w: 32, h: 32 },
        ],
        spriteSheetName
      ),
      offset: [0, -32],
      zIndex: 2,
    },
    {
      sprite: new Sprite(
        [
          { x: 224, y: 96, w: 32, h: 32 },
          { x: 288, y: 96, w: 32, h: 32 },
          { x: 352, y: 96, w: 32, h: 32 },
        ],
        spriteSheetName
      ),
      offset: [0, 0],
      zIndex: 1,
    },
  ],
  [directions.down]: [
    {
      sprite: new Sprite(
        [
          { x: 0, y: 64, w: 32, h: 32 },
          { x: 64, y: 64, w: 32, h: 32 },
          { x: 128, y: 64, w: 32, h: 32 },
        ],
        spriteSheetName
      ),
      offset: [-32, -32],
      zIndex: 2,
    },
    {
      sprite: new Sprite(
        [
          { x: 0, y: 96, w: 32, h: 32 },
          { x: 64, y: 96, w: 32, h: 32 },
          { x: 128, y: 96, w: 32, h: 32 },
        ],
        spriteSheetName
      ),
      offset: [-32, 0],
      zIndex: 2,
    },
    {
      sprite: new Sprite(
        [
          { x: 32, y: 64, w: 32, h: 32 },
          { x: 96, y: 64, w: 32, h: 32 },
          { x: 160, y: 64, w: 32, h: 32 },
        ],
        spriteSheetName
      ),
      offset: [0, -32],
      zIndex: 2,
    },
    {
      sprite: new Sprite(
        [
          { x: 32, y: 96, w: 32, h: 32 },
          { x: 96, y: 96, w: 32, h: 32 },
          { x: 160, y: 96, w: 32, h: 32 },
        ],
        spriteSheetName
      ),
      offset: [0, 0],
      zIndex: 1,
    },
  ],
  [directions.left]: [
    {
      sprite: new Sprite(
        [
          { x: 64, y: 128, w: 32, h: 32 },
          { x: 128, y: 128, w: 32, h: 32 },
          { x: 192, y: 128, w: 32, h: 32 },
        ],
        spriteSheetName
      ),
      offset: [-32, -32],
      zIndex: 2,
    },
    {
      sprite: new Sprite(
        [
          { x: 64, y: 160, w: 32, h: 32 },
          { x: 128, y: 160, w: 32, h: 32 },
          { x: 192, y: 160, w: 32, h: 32 },
        ],
        spriteSheetName
      ),
      offset: [-32, 0],
      zIndex: 2,
    },
    {
      sprite: new Sprite(
        [
          { x: 96, y: 128, w: 32, h: 32 },
          { x: 160, y: 128, w: 32, h: 32 },
          { x: 224, y: 128, w: 32, h: 32 },
        ],
        spriteSheetName
      ),
      offset: [0, -32],
      zIndex: 1,
    },
    {
      sprite: new Sprite(
        [
          { x: 96, y: 160, w: 32, h: 32 },
          { x: 160, y: 160, w: 32, h: 32 },
          { x: 224, y: 160, w: 32, h: 32 },
        ],
        spriteSheetName
      ),
      offset: [0, 0],
      zIndex: 1,
    },
  ] /* new Sprite(
    [
      { x: 96, y: 160, w: 32, h: 32 },
      { x: 160, y: 160, w: 32, h: 32 },
      { x: 224, y: 160, w: 32, h: 32 },
    ],
    spriteSheetName
  ) */,
};
