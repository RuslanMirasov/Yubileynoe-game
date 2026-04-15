import { initPreloader } from './preloader.js';
import { initGame } from './game/index.js';

const PRELOADER_DELAY = 500;
const INIT_GAME_DELAY = 2000;

initPreloader(PRELOADER_DELAY);
initGame(INIT_GAME_DELAY);
