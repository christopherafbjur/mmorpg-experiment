import Game from "./modules/game/game.js";
import settings from "./modules/mapSettings";

const canvas = new Game(settings);
canvas.initialize();
