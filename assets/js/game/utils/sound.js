import { ITEM_TYPES } from '../items/types.js';

const BACKGROUND_SOUND_SRC = './assets/sounds/background.mp3';
const FALL_SOUND_SRC = './assets/sounds/fall.mp3';
const CATCH_SOUND_SRC = './assets/sounds/catch.mp3';

let backgroundAudio = null;
let backgroundStarted = false;

const playAudio = src => {
  const audio = new Audio(src);
  audio.play().catch(() => {});
};

const startBackgroundAudio = () => {
  if (!backgroundAudio || backgroundStarted) return;

  backgroundStarted = true;
  backgroundAudio.currentTime = 0;
  backgroundAudio.play().catch(() => {
    backgroundStarted = false;
  });
};

export const initGameAudio = () => {
  if (!backgroundAudio) {
    backgroundAudio = new Audio(BACKGROUND_SOUND_SRC);
    backgroundAudio.loop = true;
    backgroundAudio.preload = 'auto';
  }

  const unlockAudio = () => {
    startBackgroundAudio();
    document.removeEventListener('pointerdown', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
    document.removeEventListener('mousedown', unlockAudio);
    document.removeEventListener('click', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };

  document.addEventListener('pointerdown', unlockAudio, { once: true, capture: true });
  document.addEventListener('touchstart', unlockAudio, { once: true, capture: true });
  document.addEventListener('mousedown', unlockAudio, { once: true, capture: true });
  document.addEventListener('click', unlockAudio, { once: true, capture: true });
  window.addEventListener('keydown', unlockAudio, { once: true });
};

export const playCatchSound = scoreType => {
  playAudio(FALL_SOUND_SRC);

  if (scoreType === ITEM_TYPES.PLUS) {
    playAudio(CATCH_SOUND_SRC);
  }
};
