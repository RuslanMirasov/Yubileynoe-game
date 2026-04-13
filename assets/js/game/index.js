import { createGameState } from './state.js';
import { initBasketMove } from './basket/move.js';
import { initBasketScan } from './basket/scan.js';
import { initItemsSpawn } from './items/spawn.js';
import { initItemsFall } from './items/fall.js';

export const initGame = () => {
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

  const fallController = initItemsFall({
    canvas,
    state,
  });

  initItemsSpawn({
    canvas,
    basket,
    scanner: targetScanner,
    state,
    registerItem: fallController?.registerItem,
  });
};
