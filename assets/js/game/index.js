import { createGameState } from './state.js';
import { initBasketMove } from './basket/move.js';

export const initGame = () => {
  const canvas = document.querySelector('[data-game-canvas]');
  const basket = document.querySelector('[data-basket]');
  const basketBack = document.querySelector('[data-basket-back]');
  const targetScanner = document.querySelector('[data-target-scanner]');
  const plusPoints = document.querySelector('[data-my-points]');
  const minusPoints = document.querySelector('[data-target-points]');

  if (!canvas || !basket) return;

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
};
