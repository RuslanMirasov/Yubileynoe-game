import { ITEM_TYPES } from '../items/types.js';

const FALL_SOUND_SRC = './assets/sounds/fall.mp3';
const CATCH_SOUND_SRC = './assets/sounds/catch.mp3';

let soundLibrary = null;

const createPreloadedAudio = src => {
  const audio = new Audio(src);
  audio.preload = 'auto';
  audio.load();
  return audio;
};

const playAudio = audioTemplate => {
  if (!audioTemplate) return;

  const audio = audioTemplate.cloneNode();
  audio.currentTime = 0;
  audio.play().catch(() => {});
};

export const initGameAudio = () => {
  if (soundLibrary) return;

  soundLibrary = {
    fall: createPreloadedAudio(FALL_SOUND_SRC),
    catch: createPreloadedAudio(CATCH_SOUND_SRC),
  };
};

export const playCatchSound = scoreType => {
  if (!soundLibrary) {
    initGameAudio();
  }

  playAudio(soundLibrary?.fall);

  if (scoreType === ITEM_TYPES.PLUS) {
    playAudio(soundLibrary?.catch);
  }
};
