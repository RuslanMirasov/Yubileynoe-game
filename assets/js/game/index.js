import { createGameState } from './state.js';
import { initBasketMove } from './basket/move.js';
import { initBasketScan } from './basket/scan.js';
import { initItemsSpawn } from './items/spawn.js';
import { initItemsFall } from './items/fall.js';
import { initPoints } from './score/points.js';
import { initGameAudio, playGameOverSound, playSuccessSound } from './utils/sound.js';
import { GAME_TIME } from './constants.js';

let currentGame = null;
let gameBootstrapped = false;
let scheduledStartTimeoutId = null;

export const initGame = (delay = 0) => {
  const gameCanvas = document.querySelector('[data-game-canvas]');
  const gameBasket = document.querySelector('[data-basket]');

  if (!gameCanvas || !gameBasket) return;

  initGameAudio();

  const cleanupCurrentGame = () => {
    if (scheduledStartTimeoutId) {
      window.clearTimeout(scheduledStartTimeoutId);
      scheduledStartTimeoutId = null;
    }

    if (!currentGame) return;

    if (currentGame.state.finishRafId) {
      cancelAnimationFrame(currentGame.state.finishRafId);
      currentGame.state.finishRafId = null;
    }

    currentGame.moveController?.destroy?.();
    currentGame.scanController?.destroy?.();
    currentGame.spawnController?.destroy?.();
    currentGame.fallController?.destroy?.();

    currentGame = null;
  };

  const startGame = () => {
    const canvas = document.querySelector('[data-game-canvas]');
    const basket = document.querySelector('[data-basket]');
    const basketBack = document.querySelector('[data-basket-back]');
    const targetScanner = document.querySelector('[data-target-scanner]');
    const plusPoints = Array.from(document.querySelectorAll('[data-my-points]'));
    const minusPoints = Array.from(document.querySelectorAll('[data-target-points]'));

    if (!canvas || !basket || !basketBack || !targetScanner || plusPoints.length === 0 || minusPoints.length === 0) return;

    cleanupCurrentGame();
    window.popup?.close?.();

    const state = createGameState();

    const elements = {
      canvas,
      basket,
      basketBack,
      targetScanner,
      plusPoints,
      minusPoints,
    };

    const moveController = initBasketMove({
      canvas: elements.canvas,
      basket: elements.basket,
      basketBack: elements.basketBack,
      state,
    });

    const scanController = initBasketScan({
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

    const spawnController = initItemsSpawn({
      canvas,
      basket,
      scanner: targetScanner,
      state,
      registerItem: fallController?.registerItem,
    });

    const finishGame = () => {
      if (state.isGameFinished) return;

      state.isGameFinished = true;

      moveController?.destroy?.();
      scanController?.destroy?.();
      spawnController?.destroy?.();
      fallController?.destroy?.();

      const popupId = state.targetPoints === 0 ? 'success' : 'try-again';

      window.popup?.open?.(popupId);

      if (popupId === 'success') {
        playSuccessSound();
      } else {
        playGameOverSound();
      }
    };

    const finishTick = now => {
      if (state.isGameFinished) return;

      const elapsed = now - state.gameStartTime;
      const isRoundTimeOver = elapsed >= GAME_TIME;
      const allItemsSpawned = state.spawnIndex >= state.spawnQueue.length;
      const noActiveItems = state.activeItems.length === 0;

      if (isRoundTimeOver && allItemsSpawned && noActiveItems) {
        finishGame();
        return;
      }

      state.finishRafId = requestAnimationFrame(finishTick);
    };

    currentGame = {
      state,
      moveController,
      scanController,
      spawnController,
      fallController,
      restart() {
        startGame();
      },
    };

    state.finishRafId = requestAnimationFrame(finishTick);
  };

  const scheduleGameStart = () => {
    scheduledStartTimeoutId = window.setTimeout(() => {
      scheduledStartTimeoutId = null;
      startGame();
    }, delay);
  };

  if (!gameBootstrapped) {
    const restartGame = event => {
      event.preventDefault();
      currentGame?.restart?.() || startGame();
    };

    document.querySelectorAll('[data-restart-game]').forEach(button => {
      button.addEventListener('click', restartGame);
    });

    window.game = {
      restart: () => {
        currentGame?.restart?.() || startGame();
      },
    };

    gameBootstrapped = true;
  }

  if (document.readyState === 'complete') {
    scheduleGameStart();
  } else {
    window.addEventListener('load', scheduleGameStart, { once: true });
  }
};
