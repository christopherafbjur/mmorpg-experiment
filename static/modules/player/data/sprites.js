import Sprite from "../../sprite";
import directions from "./directions";
export default {
  [directions.up]: new Sprite([{ x: 0, y: 120, w: 30, h: 30 }]),
  [directions.right]: new Sprite([{ x: 0, y: 150, w: 30, h: 30 }]),
  [directions.down]: new Sprite([{ x: 0, y: 180, w: 30, h: 30 }]),
  [directions.left]: new Sprite([{ x: 0, y: 210, w: 30, h: 30 }]),
};
