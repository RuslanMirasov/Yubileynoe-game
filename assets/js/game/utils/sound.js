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
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };

  window.addEventListener('pointerdown', unlockAudio, { once: true });
  window.addEventListener('keydown', unlockAudio, { once: true });
  window.addEventListener('touchstart', unlockAudio, { once: true });
};

export const playCatchSound = scoreType => {
  playAudio(FALL_SOUND_SRC);

  if (scoreType === ITEM_TYPES.PLUS) {
    playAudio(CATCH_SOUND_SRC);
  }
};
