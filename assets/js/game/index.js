import { createGameState } from './state.js';
import { initBasketMove } from './basket/move.js';
import { initBasketScan } from './basket/scan.js';
import { initItemsSpawn } from './items/spawn.js';
import { initItemsFall } from './items/fall.js';
import { initPoints } from './score/points.js';
import { initGameAudio } from './utils/sound.js';

export const initGame = (delay = 0) => {
  const gameCanvas = document.querySelector('[data-game-canvas]');
  const gameBasket = document.querySelector('[data-basket]');

  if (!gameCanvas || !gameBasket) return;

  initGameAudio();

  const startGame = () => {
    const canvas = document.querySelector('[data-game-canvas]');
    const basket = document.querySelector('[data-basket]');
    const basketBack = document.querySelector('[data-basket-back]');
    const targetScanner = document.querySelector('[data-target-scanner]');
    const plusPoints = document.querySelector('[data-my-points]');
    const minusPoints = document.querySelector('[data-target-points]');

    if (!canvas || !basket || !basketBack || !targetScanner) return;

    const state = createGameState();

    const elements = {
      canvas,
      basket,
      basketBack,
      targetScanner,
      plusPoints,
      minusPoints,
    };

    initBasketMove({
      canvas: elements.canvas,
      basket: elements.basket,
      basketBack: elements.basketBack,
      state,
    });

    initBasketScan({
      canvas,
      scanner: targetScanner,
      state,
    });

    const pointsController = initPoints({
      plusPoints,
      minusPoints,
      state,
    });

    const fallController = initItemsFall({
      canvas,
      basket,
      state,
      onItemCatch: pointsController?.handleItemCatch,
    });

    initItemsSpawn({
      canvas,
      basket,
      scanner: targetScanner,
      state,
      registerItem: fallController?.registerItem,
    });
  };

  const scheduleGameStart = () => {
    window.setTimeout(startGame, delay);
  };

  if (document.readyState === 'complete') {
    scheduleGameStart();
  } else {
    window.addEventListener('load', scheduleGameStart, { once: true });
  }
};
